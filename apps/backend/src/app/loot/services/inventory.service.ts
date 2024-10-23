import { Injectable } from '@nestjs/common';
import { Inventory } from '../entities/inventory.entity';
import { Item } from '../entities/item.entity';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class InventoryService {
  private queueEvents: QueueEvents;
  constructor(
    @InjectQueue('inventory') private readonly inventoryQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('inventory');
  }

  async getInventory(heroId: string): Promise<Inventory> {
    const job = await this.inventoryQueue.add('get', { heroId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async addToInventory(heroId: string, item: Item): Promise<Inventory> {
    const job = await this.inventoryQueue.add('add', { heroId, item });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async sellFromInventory(heroId: string, uniqueId: string, price?: number) {
    const job = await this.inventoryQueue.add('sell-item', { heroId, uniqueId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getByRarity(
    heroId: string,
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): Promise<Item[]> {
    const job = await this.inventoryQueue.add('get-by-rarity', {
      heroId,
      rarity,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
