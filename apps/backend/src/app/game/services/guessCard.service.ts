import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { HeroInterface } from '@org/users';
import { Queue, QueueEvents } from 'bullmq';
import { Card } from '../processors/guessTheCard.processor';

@Injectable()
export class GuessCardService {
  private queueEvents: QueueEvents;

  constructor(
    @InjectQueue('guess-the-card') private readonly guessCardQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('guess-the-card');
  }

  async startGame(hero: HeroInterface, betAmount: number) {
    const job = await this.guessCardQueue.add('start-game', {
      hero,
      betAmount,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async chooseCard(hero: HeroInterface, cardId: number, cards: Card[]) {
    const job = await this.guessCardQueue.add('choose-card', {
      hero,
      cardId,
      cards,
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
