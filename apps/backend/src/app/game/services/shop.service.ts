import { Injectable } from '@nestjs/common';
import { DeleteItemBoxDto } from '../../loot/dtos/DeleteItemBox.dto';
import { HeroDocument } from 'libs/users/src/lib/shemas/hero.schema';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { Types } from 'mongoose';

@Injectable()
export class ShopService {
  private queueEvents: QueueEvents;
  constructor(@InjectQueue('shop') private readonly shopQueue: Queue) {
    this.queueEvents = new QueueEvents('shop');
  }

  async buyCase(
    hero: HeroDocument,
    price: number,
    itemBoxId: DeleteItemBoxDto
  ) {
    const job = await this.shopQueue.add('buy-case', {
      hero,
      price,
      itemBoxId,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async buyReset(heroId: string, price: number) {
    const job = await this.shopQueue.add('buy-reset-skills', {
      heroId,
      price,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async buyRandomItemByRarity(
    hero: HeroDocument,
    price: number,
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ) {
    const job = await this.shopQueue.add('buy-random-item', {
      hero,
      price,
      rarity,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async buyHealth(heroId: string, hp: number, price: number) {
    const job = await this.shopQueue.add('buy-health', {
      heroId,
      hp,
      price,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async buyPotion(heroId: string, potionId: number, price: number) {
    const job = await this.shopQueue.add('buy-potion', {
      heroId,
      potionId,
      price,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result; 
  }
}
