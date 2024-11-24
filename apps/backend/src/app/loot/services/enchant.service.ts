import { Injectable } from '@nestjs/common';
import { Enchant } from '../entities/enchant.entity';
import { Item } from '../entities/item.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ReenchantDto } from '../dtos/Reenchant.dto';

@Injectable()
export class EnchantService {
  private queueEvents: QueueEvents
  constructor(
    @InjectQueue('enchant') private readonly enchantQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('enchant')
  }

/**
 * Applies an enchantment to the given item.
 * @param item The item to which the enchantment will be applied.
 * @returns A promise that resolves to the `Item` object with the applied enchantment.
 */
  async applyEnchantment(item: Item): Promise<Item> {
   const job = await this.enchantQueue.add('apply-enchantment', {item})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Reenchants an item.
   * @param data The data to reenchant the item with.
   * @returns The reenchanted item.
   */
  async reenchantItem(data: ReenchantDto): Promise<Item>{
    const job = await this.enchantQueue.add('reenchant', data)
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Creates a new enchantment.
   * @param createEnchantDto The data to create the enchantment with.
   * @returns The newly created enchantment.
   */
  async createEnchant(createEnchantDto: CreateEnchantDto): Promise<Enchant> {
    const job = await this.enchantQueue.add('create-enchant', {createEnchantDto})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Updates an enchantment.
   * @param id The ID of the enchantment to update.
   * @param updateEnchantDto The data to update the enchantment with.
   * @returns A promise that resolves to the `Enchant` object with the updated data.
   */
  async updateEnchant(id: number, updateEnchantDto: UpdateEnchantDto): Promise<Enchant> {
    const job = await this.enchantQueue.add('update-enchant', {id, updateEnchantDto})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Deletes an enchantment.
   * @param id The ID of the enchantment to delete.
   * @returns A promise that resolves to a string indicating the success of the deletion.
   */
  async deleteEnchant(id: number): Promise<string> {
    const job = await this.enchantQueue.add('delete-enchant', {id})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Finds an enchantment by its ID.
   * @param id The ID of the enchantment to find.
   * @returns A promise that resolves to the `Enchant` object with the given ID.
   */
  async getEnchantById(id: number): Promise<Enchant> {
    const job = await this.enchantQueue.add('get-enchant', {id})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  /**
   * Finds all enchantments.
   * @returns A promise that resolves to an array of `Enchant` objects.
   */
  async findAllEnchants(): Promise<Enchant[]> {
    const job = await this.enchantQueue.add('find-all-enchants', {})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }
}
