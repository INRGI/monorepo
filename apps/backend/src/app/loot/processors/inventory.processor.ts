import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';
import { Item } from '../entities/item.entity';
import { Equip } from '../entities/equip.entity';

@Processor('inventory')
export class InventoryProcessor extends WorkerHost {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: Repository<Inventory>,
    @Inject('EQUIP_REPOSITORY')
    private equipRepository: Repository<Equip>,
    private readonly heroService: HeroService,
    @InjectQueue('quests') private readonly questsQueue: Queue
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      switch (job.name) {
        case 'get': {
          const { heroId } = job.data;
          return await this.getInventory(heroId);
        }
        case 'add': {
          return await this.handleAddJob(job.data);
        }
        case 'sell-item': {
          return await this.handleSellItemJob(job.data);
        }
        case 'get-by-rarity': {
          return await this.handleItemByRarity(job.data);
        }
        case 'find-one': {
          return await this.findOneItem(job.data);
        }
        case 'get-equiped': {
          return await this.handleGetEquipJob(job.data);
        }
        case 'equip-item': {
          return await this.handleEquipJob(job.data);
        }
        case 'unequip-item': {
          return await this.handleUnequipJob(job.data);
        }
      }
    } catch (error) {
      throw error;
    }
  }

  private async handleGetEquipJob(data: { heroId: string }) {
    const { heroId } = data;

    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.equip', 'equip')
      .where('inventory.heroId = :heroId', { heroId: heroId })
      .getOne();

    if (!inventory) {
      throw new Error('Inventory not found for this hero');
    }

    return inventory.equip;
  }

  private async handleEquipJob(data: { heroId: string; uniqueId: string }) {
    const { heroId, uniqueId } = data;

    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.equip', 'equip')
      .where('inventory.heroId = :heroId', { heroId })
      .getOne();

    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const itemToEquip = inventory.inventory.find(
      (item) => item.uniqueId === uniqueId
    );

    if (!itemToEquip) {
      throw new Error('Item not found in inventory');
    }

    const updatedInventory = inventory.inventory.filter(
      (item) => item.uniqueId !== uniqueId
    );

    await this.inventoryRepository.update(
      { heroId },
      { inventory: updatedInventory }
    );

    const equip: Equip = await this.equipRepository.findOne({
      where: { id: inventory.equip.id },
    });

    if (itemToEquip.type === 'weapon') {
      await this.handleUnequipJob({ heroId, itemType: 'weapon' });
      equip.weapon = itemToEquip;
    }
    if (itemToEquip.type === 'armor') {
      await this.handleUnequipJob({ heroId, itemType: 'armor' });
      equip.armor = itemToEquip;
    }

    await this.equipRepository.save(equip);
    return inventory.inventory;
  }

  private async handleUnequipJob(data: {
    heroId: string;
    itemType: 'weapon' | 'armor';
  }) {
    const { heroId, itemType } = data;

    const inventory = await this.inventoryRepository
      .createQueryBuilder('inventory')
      .leftJoinAndSelect('inventory.equip', 'equip')
      .where('inventory.heroId = :heroId', { heroId })
      .getOne();

    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const equip: Equip = await this.equipRepository.findOne({
      where: { id: inventory.equip.id },
    });
    if (!equip) {
      throw new Error('Equip record not found');
    }

    let itemToUnequip: Item;

    if (itemType === 'weapon') {
      itemToUnequip = equip.weapon;
      equip.weapon = null;
    }
    if (itemType === 'armor') {
      itemToUnequip = equip.armor;
      equip.armor = null;
    }

    if (itemToUnequip) {
      inventory.inventory.push(itemToUnequip);
    }

    await this.equipRepository.save(equip);
    await this.inventoryRepository.save(inventory);
    
    return inventory.inventory;
  }

  private async getInventory(heroId: string): Promise<Inventory> {
    let inventory = await this.inventoryRepository.findOne({
      where: { heroId },
    });
    if (!inventory) {
      inventory = this.inventoryRepository.create({
        heroId,
        inventory: [],
      });
    }

    return await this.inventoryRepository.save(inventory);
  }

  private async findOneItem(data: {
    heroId: string;
    uniqueId: string;
  }): Promise<Item> {
    const { heroId, uniqueId } = data;
    const inventory = await this.getInventory(heroId);
    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const item = inventory.inventory.filter(
      (item) => item.uniqueId === uniqueId
    );
    if (!item[0]) {
      throw new Error('Item not found');
    }

    return item[0];
  }

  private async handleAddJob(data: {
    heroId: string;
    item: Item;
  }): Promise<any> {
    const { heroId, item } = data;
    if (!item) return;
    let inventory = await this.getInventory(heroId);

    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    inventory.inventory.push(item);
    return await this.inventoryRepository.save(inventory);
  }

  private async handleSellItemJob(data: {
    heroId: string;
    uniqueId: string;
    price?: number;
  }): Promise<any> {
    const { heroId, uniqueId, price } = data;
    const inventory = await this.getInventory(heroId);
    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const updatedInventory = inventory.inventory.filter(
      (item) => item.uniqueId !== uniqueId
    );
    if (updatedInventory.length === inventory.inventory.length) {
      throw new Error('Item not found in inventory');
    }

    const heroIdMongo: Types.ObjectId = heroId as unknown as Types.ObjectId;
    const itemToSell = inventory.inventory.find(
      (item) => item.uniqueId === uniqueId
    );
    if (!itemToSell) {
      throw new Error('Item not found in inventory');
    }

    await this.inventoryRepository.update(
      { heroId },
      { inventory: updatedInventory }
    );
    await this.heroService.earnCoins(
      heroIdMongo,
      price || this.getValueOfItem(itemToSell.rarity)
    );
    await this.questsQueue.add('complete-quest', {
      heroId: heroId,
      type: 'Selling',
    });
    return updatedInventory;
  }

  private async handleItemByRarity(data: {
    heroId: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }): Promise<any> {
    const { heroId, rarity } = data;
    const inventory = await this.getInventory(heroId);
    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const filteredItems =
      inventory.inventory?.filter((item: Item) => item.rarity === rarity) || [];
    console.log('filtered:', filteredItems);
    return filteredItems;
  }

  private getValueOfItem(
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): number {
    if (rarity === 'common') return 5;
    if (rarity === 'rare') return 20;
    if (rarity === 'epic') return 100;
    return 400;
  }
}
