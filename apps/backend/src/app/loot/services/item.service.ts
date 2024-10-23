import { Injectable } from '@nestjs/common';
import { Item } from '../entities/item.entity';
import { CreateItemDto } from '../dtos/CreateItem.dto';
import { UpdateItemDto } from '../dtos/UpdateItem.dto';
import { DeleteItemDto } from '../dtos/DeleteItem.dto';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class ItemService {
  private queueEvents: QueueEvents;
  constructor(@InjectQueue('item') private readonly itemQueue: Queue) {
    this.queueEvents = new QueueEvents('item');
  }

  async findAll(): Promise<Item[]> {
    const job = await this.itemQueue.add('find-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async findOne(id: string): Promise<Item> {
    const job = await this.itemQueue.add('find-one', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async create(itemData: CreateItemDto): Promise<Item> {
    const job = await this.itemQueue.add('create', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async update(itemData: UpdateItemDto): Promise<Partial<Item>> {
    const job = await this.itemQueue.add('update', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async delete(itemBoxId: DeleteItemDto) {
    const job = await this.itemQueue.add('delete', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
