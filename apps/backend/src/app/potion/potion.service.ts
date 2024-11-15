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

  async getAllPotions() {
    const job = await this.potionQueue.add('get-all-potions', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async createPotion(createPotionDto: CreatePotionDto) {
    const job = await this.potionQueue.add('create', {createPotionDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async addPotionToHero(potionId: number, heroId: string) {
    const job = await this.potionQueue.add('add', {potionId, heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async activatePotion(activatePotionDto: ActivatePotionDto) {
    const job = await this.potionQueue.add('activate', {activatePotionDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getHeroesPotions(heroId: string) {
    const job = await this.potionQueue.add('get-heroes', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
