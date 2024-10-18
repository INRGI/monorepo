import { Injectable } from '@nestjs/common';
import { ItemBox } from '../entities/itemBox.entity';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';
import { UpdateItemBoxDto } from '../dtos/UpdateItemBox.dto';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';
import { Item } from '../entities/item.entity';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ItemBoxService {
  private queueEvents: QueueEvents;
  constructor(@InjectQueue('itemBox') private readonly itemBoxQueue: Queue) {
    this.queueEvents = new QueueEvents('itemBox');
  }

  async findAll(): Promise<ItemBox[]> {
    const job = await this.itemBoxQueue.add('find-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async findTheMostExpensive(): Promise<ItemBox[]> {
    const job = await this.itemBoxQueue.add('find-the-most-expensive', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async create(itemBoxData: CreateItemBoxDto): Promise<ItemBox> {
    const job = await this.itemBoxQueue.add('create', { itemBoxData });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async update(itemBoxData: UpdateItemBoxDto): Promise<Partial<ItemBox>> {
    const job = await this.itemBoxQueue.add('update', { itemBoxData });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async delete(itemBoxId: DeleteItemBoxDto) {
    const job = await this.itemBoxQueue.add('delete', { itemBoxId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async randomItemByRarity(
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): Promise<Item> {
    const job = await this.itemBoxQueue.add('random-item-by-rarity', {
      rarity,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async randomItemInABox(itemBoxId: DeleteItemBoxDto): Promise<Item> {
    const job = await this.itemBoxQueue.add('random-item-in-box', {
      itemBoxId,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
