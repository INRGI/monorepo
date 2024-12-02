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
        case 'update-item': {
          return await this.handleUpdateItemJob(job.data);
        }
      }
    } catch (error) {
      throw error;
    }
  }

/**
 * Retrieves the equipped items for a hero.
 * @param data - An object containing the heroId.
 * @returns The equipped items of the hero.
 * @throws An error if the inventory is not found for the given heroId.
 */
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

  /**
   * Equips an item for a hero.
   * @param data - An object containing the heroId and the uniqueId of the item to equip.
   * @returns The updated inventory of the hero.
   * @throws An error if the inventory is not found or the item is not found in the inventory.
   */
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
      const attack = itemToEquip?.stats?.attack;

      await this.handleUnequipJob({ heroId, itemType: 'weapon' });
      await this.heroService.addAttack(
        heroId as unknown as Types.ObjectId,
        attack
      );
      equip.weapon = itemToEquip;
    }
    if (itemToEquip.type === 'armor') {
      const health = itemToEquip?.stats?.health;
      await this.handleUnequipJob({ heroId, itemType: 'armor' });
      await this.heroService.addHealth(
        heroId as unknown as Types.ObjectId,
        health
      );
      equip.armor = itemToEquip;
    }

    await this.equipRepository.save(equip);
    return inventory.inventory;
  }

/**
 * Handles the unequip job for a hero's item.
 *
 * This function unequips an item (either weapon or armor) from the hero's 
 * equipped inventory, updates the hero's stats by reducing the corresponding 
 * attribute (attack or health), and then adds the unequipped item back to the 
 * hero's main inventory.
 *
 * @param data - An object containing the heroId and the itemType ('weapon' or 'armor')
 *               to be unequipped.
 * 
 * @throws Will throw an error if the inventory or equip record is not found.
 * 
 * @returns The updated inventory of the hero after unequipping the item.
 */
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

      if (itemToUnequip) {
        const attack = itemToUnequip?.stats?.attack;
        await this.heroService.minusAttack(
          heroId as unknown as Types.ObjectId,
          attack
        );
      }

      equip.weapon = null;
    }
    if (itemType === 'armor') {
      itemToUnequip = equip.armor;
      if (itemToUnequip) {
        const health = itemToUnequip?.stats?.health;
        await this.heroService.minusHealth(
          heroId as unknown as Types.ObjectId,
          health
        );
      }
      equip.armor = null;
    }

    if (itemToUnequip) {
      inventory.inventory.push(itemToUnequip);
    }

    await this.equipRepository.save(equip);
    await this.inventoryRepository.save(inventory);

    return inventory.inventory;
  }

/**
 * Retrieves or initializes the inventory for a given hero.
 * 
 * This function attempts to find an existing inventory associated with the provided
 * heroId. If no inventory is found, it creates a new inventory entry for the hero.
 * The inventory is then saved and returned.
 * 
 * @param heroId - The unique identifier of the hero for whom the inventory is to be fetched or created.
 * @returns A promise that resolves to the inventory of the hero.
 */
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

/**
 * Finds a specific item in the hero's inventory based on the unique ID.
 * 
 * @param data - An object containing the heroId and the uniqueId of the item to be found.
 * @returns A promise that resolves to the found item.
 * @throws An error if the inventory is not found or the item is not found in the inventory.
 */
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

  /**
   * Adds an item to a hero's inventory.
   * 
   * @param data - An object containing the heroId and the item to be added.
   * @returns A promise that resolves to the updated inventory of the hero.
   * @throws An error if the inventory is not found.
   */
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

  /**
   * Sells an item in the hero's inventory based on the unique ID.
   * 
   * @param data - An object containing the heroId, the uniqueId of the item to be sold, and optionally the price to sell the item for.
   * @returns A promise that resolves to the updated inventory of the hero.
   * @throws An error if the inventory is not found or the item is not found in the inventory.
   */
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

  /**
   * Updates an item in the hero's inventory.
   * @param data - An object containing the heroId and the item to be updated.
   * @returns The updated inventory of the hero.
   * @throws An error if the inventory is not found.
   */
  private async handleUpdateItemJob(data: { heroId: string; item: Item }) {
    const { heroId, item } = data;

    const inventory = await this.getInventory(heroId);
    if (!inventory.inventory) {
      throw new Error('Inventory not found');
    }

    const updatedInventory = inventory.inventory.map((itemInv) => {
      if (itemInv.uniqueId !== item.uniqueId) return itemInv;

      return { ...itemInv, ...item };
    });

    await this.inventoryRepository.update(
      { heroId },
      { inventory: updatedInventory }
    );

    return updatedInventory;
  }

  /**
   * Filters items in the hero's inventory by the given rarity.
   * @param data - An object containing the heroId and the rarity to filter by.
   * @returns An array of items in the hero's inventory that match the given rarity.
   * @throws An error if the inventory is not found.
   */
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
    return filteredItems;
  }

  /**
   * Gets the value of an item based on its rarity.
   * @param rarity - The rarity of the item.
   * @returns The value of the item.
   */
  private getValueOfItem(
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): number {
    if (rarity === 'common') return 5;
    if (rarity === 'rare') return 20;
    if (rarity === 'epic') return 100;
    return 400;
  }
}
