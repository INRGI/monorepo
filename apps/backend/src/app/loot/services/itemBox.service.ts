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

  /**
   * Finds all itemBoxes that contain all 4 types of items.
   * @returns An array of itemBoxes, sorted by name in ascending order.
   */
  async findAll(): Promise<ItemBox[]> {
    const job = await this.itemBoxQueue.add('find-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

/**
 * Finds the 3 most expensive itemBoxes that contain all 4 types of items.
 * @returns A promise that resolves with an array of 3 itemBoxes, sorted by cost in descending order.
 */
  async findTheMostExpensive(): Promise<ItemBox[]> {
    const job = await this.itemBoxQueue.add('find-the-most-expensive', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Creates a new itemBox in the repository with the provided data.
   * @param itemBoxData - An object containing the itemBox data to be created.
   * @returns The newly created and saved itemBox.
   * @throws An error if an itemBox with the same name already exists.
   */
  async create(itemBoxData: CreateItemBoxDto): Promise<ItemBox> {
    const job = await this.itemBoxQueue.add('create', { itemBoxData });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Updates an itemBox with the given id.
   * @param itemBoxData - An object containing the updated itemBox data.
   * @returns The updated itemBox.
   * @throws An error if no itemBox with the given id is found.
   */
  async update(itemBoxData: UpdateItemBoxDto): Promise<Partial<ItemBox>> {
    const job = await this.itemBoxQueue.add('update', { itemBoxData });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Deletes an itemBox with the given id.
   * @param itemBoxId - An object containing the id of the itemBox to delete.
   * @returns A message indicating that the itemBox was deleted.
   * @throws An error if no itemBox with the given id is found.
   */
  async delete(itemBoxId: DeleteItemBoxDto) {
    const job = await this.itemBoxQueue.add('delete', { itemBoxId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

/**
 * Selects a random item of the specified rarity, applies enchantments, and returns the item.
 * @param rarity - The rarity of the item to be selected. Can be 'common', 'rare', 'epic', or 'legendary'.
 * @returns A promise that resolves with the randomly selected and enchanted item.
 * @throws An error if no items of the given rarity are found.
 */
  async randomItemByRarity(
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): Promise<Item> {
    const job = await this.itemBoxQueue.add('random-item-by-rarity', {
      rarity,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Selects a random item from the itemBox with the given id, applies enchantments, and returns the item.
   * @param itemBoxId - An object containing the id of the itemBox to select from.
   * @returns A promise that resolves with the randomly selected and enchanted item.
   * @throws An error if no items in the itemBox with the given id are found.
   */
  async randomItemInABox(itemBoxId: DeleteItemBoxDto): Promise<Item> {
    const job = await this.itemBoxQueue.add('random-item-in-box', {
      itemBoxId,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
