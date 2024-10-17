import { Injectable } from '@nestjs/common';
import { Monster } from '../monster/monster.service';
import { HeroDocument, HeroInterface } from '@org/users';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class BattleService {
  private queueEvents: QueueEvents
  constructor(
    @InjectQueue('game') private readonly gameQueue: Queue
  ) {this.queueEvents = new QueueEvents('game');}

  async getMonsters(): Promise<Monster[]> {
    const job = await this.gameQueue.add('get-monsters', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async attack(
    character: HeroInterface,
    monsterId: number
  ): Promise<{ monster: Monster; hero: HeroDocument }> {
    const job = await this.gameQueue.add('attack', { character, monsterId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  
}
