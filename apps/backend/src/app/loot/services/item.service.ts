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

  /**
   * Find all items in the database.
   *
   * @returns A promise that resolves with an array of items.
   */
  async findAll(): Promise<Item[]> {
    const job = await this.itemQueue.add('find-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Finds a single item by its unique identifier.
   *
   * @param id - The unique identifier of the item to find.
   * @returns A promise that resolves with the item if found.
   */
  async findOne(id: string): Promise<Item> {
    const job = await this.itemQueue.add('find-one', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Creates a new item with the given data.
   * @param itemData - The new item data.
   * @returns A promise that resolves with the newly created item.
   */
  async create(itemData: CreateItemDto): Promise<Item> {
    const job = await this.itemQueue.add('create', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Updates an item with the given id.
   * @param itemData - An object containing the updated item data.
   * @returns A promise that resolves with the updated item.
   * @throws An error if no item with the given id is found.
   */
  async update(itemData: UpdateItemDto): Promise<Partial<Item>> {
    const job = await this.itemQueue.add('update', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Deletes an item with the given id.
   * @param itemBoxId - The id of the item to delete.
   * @returns A promise that resolves with a message indicating that the item was deleted.
   * @throws An error if no item with the given id is found.
   */
  async delete(itemBoxId: DeleteItemDto) {
    const job = await this.itemQueue.add('delete', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
