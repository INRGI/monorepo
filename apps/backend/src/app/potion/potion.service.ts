import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreatePotionDto } from './dtos/createPotion.dto';
import { ActivatePotionDto } from './dtos/activatePotion.dto';

@Injectable()
export class PotionService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('potion') private readonly potionQueue: Queue) {
    this.queueEvents = new QueueEvents('potion');
  }

  /**
   * Retrieves all potions from the potion service.
   * 
   * @returns A promise that resolves to an array of all potions.
   */
  async getAllPotions() {
    const job = await this.potionQueue.add('get-all-potions', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  /**
   * Creates a new potion in the potion service.
   * 
   * @param createPotionDto The data to create the potion with.
   * 
   * @returns A promise that resolves to the newly created potion.
   */
  async createPotion(createPotionDto: CreatePotionDto) {
    const job = await this.potionQueue.add('create', createPotionDto);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Adds a potion to a hero's inventory.
   * 
   * @param potionId The ID of the potion to be added.
   * @param heroId The ID of the hero to whom the potion will be added.
   * 
   * @returns A promise that resolves to the result of the job that adds the potion.
   */

  async addPotionToHero(potionId: number, heroId: string) {
    const job = await this.potionQueue.add('add', {potionId, heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Activates a potion that the hero has in their inventory.
   * 
   * @param activatePotionDto The data to activate the potion with.
   * 
   * @returns A promise that resolves to the activated potion.
   * 
   * A job is added to the queue to delete the potion after 1 minute.
   */
  async activatePotion(activatePotionDto: ActivatePotionDto) {
    const job = await this.potionQueue.add('activate', activatePotionDto);
    const result = await job.waitUntilFinished(this.queueEvents);

    await this.potionQueue.add('delete-after-timeout', { heroPotionId: result.id }, { delay: 60000 });
    return result;
  }

  /**
   * Retrieves all potions associated with a specific hero.
   * 
   * @param heroId The unique identifier of the hero whose potions are to be retrieved.
   * 
   * @returns A promise that resolves to an array of potions belonging to the specified hero.
   */

  async getHeroesPotions(heroId: string) {
    const job = await this.potionQueue.add('get-heroes', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
