import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { HOL } from '../processors/holGame.processor';

@Injectable()
export class HOLGameService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('hol') private readonly golGameQueue: Queue) {
    this.queueEvents = new QueueEvents('hol');
  }

  async startGame(data: HOL) {
    const job = await this.golGameQueue.add('start-game', data);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async stopGame(data: HOL) {
    const job = await this.golGameQueue.add('stop-game', data);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async choose(data: HOL) {
    const job = await this.golGameQueue.add('choose', data);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
