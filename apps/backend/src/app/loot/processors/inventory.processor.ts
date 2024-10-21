import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';
import { Item } from '../entities/item.entity';

@Processor('inventory')
export class InventoryProcessor extends WorkerHost {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: Repository<Inventory>,
    private readonly heroService: HeroService
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
      }
    } catch (error) {
      throw error;
    }
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
  }): Promise<any> {
    const { heroId, uniqueId } = data;
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
      this.getValueOfItem(itemToSell.rarity)
    );
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
