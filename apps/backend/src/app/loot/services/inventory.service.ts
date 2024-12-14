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

  /**
   * Retrieves the inventory for a given hero.
   * @param heroId - The unique identifier of the hero for whom the inventory is to be fetched.
   * @returns A promise that resolves to the inventory of the hero.
   */
  async getInventory(heroId: string): Promise<Inventory> {
    const job = await this.inventoryQueue.add('get', { heroId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Adds an item to a hero's inventory.
   * @param heroId - The unique identifier of the hero for whom the item is to be added.
   * @param item - The item to be added.
   * @returns A promise that resolves to the updated inventory of the hero.
   */
  async addToInventory(heroId: string, item: Item): Promise<Inventory> {
    const job = await this.inventoryQueue.add('add', { heroId, item });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Sells an item from the hero's inventory.
   * 
   * @param heroId - The unique identifier of the hero whose item is to be sold.
   * @param uniqueId - The unique identifier of the item to be sold.
   * @param price - Optional price for selling the item.
   * @returns A promise that resolves to the result of the sell operation.
   */
  async sellFromInventory(heroId: string, uniqueId: string, price?: number) {
    const job = await this.inventoryQueue.add('sell-item', { heroId, uniqueId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Finds an item in a hero's inventory.
   * 
   * @param heroId - The unique identifier of the hero whose item is to be found.
   * @param uniqueId - The unique identifier of the item to be found.
   * @returns A promise that resolves to the item if found, or null if not found.
   */
  async findItem(heroId: string, uniqueId: string){
    const job = await this.inventoryQueue.add('find-one', {heroId, uniqueId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result
  }

  /**
   * Retrieves the equipped items for a hero.
   * @param heroId - The unique identifier of the hero for whom the equipped items are to be retrieved.
   * @returns A promise that resolves to the equipped items of the hero.
   */
  async getEquip(heroId: string){
    const job = await this.inventoryQueue.add('get-equiped', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result
  }

  /**
   * Equips an item in the hero's inventory.
   * @param heroId - The unique identifier of the hero whose item is to be equipped.
   * @param uniqueId - The unique identifier of the item to be equipped.
   * @returns A promise that resolves to the result of the equip operation.
   */
  async equipItem(heroId: string, uniqueId: string){
    const job = await this.inventoryQueue.add('equip-item', {heroId, uniqueId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result
  }

  /**
   * Unequips an item from the hero's inventory.
   * @param heroId - The unique identifier of the hero whose item is to be unequipped.
   * @param itemType - The type of the item to be unequipped, either 'weapon' or 'armor'.
   * @returns A promise that resolves to the result of the unequip operation.
   */
  async unequipItem(heroId: string, itemType: 'weapon' | 'armor'){
    const job = await this.inventoryQueue.add('unequip-item', {heroId, itemType});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result
  }

  /**
   * Updates an item in a hero's inventory.
   * 
   * @param heroId - The unique identifier of the hero whose item is to be updated.
   * @param item - The item with the updated properties.
   * @returns A promise that resolves to the result of the update operation.
   */
  async updateItem(heroId: string, item: Item){
    const job = await this.inventoryQueue.add('update-item',{heroId, item});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result
  }

  /**
   * Retrieves items from a hero's inventory based on the specified rarity.
   *
   * @param heroId - The unique identifier of the hero whose inventory is to be queried.
   * @param rarity - The rarity of the items to retrieve, can be 'common', 'rare', 'epic', or 'legendary'.
   * @returns A promise that resolves to an array of items matching the specified rarity.
   */
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
