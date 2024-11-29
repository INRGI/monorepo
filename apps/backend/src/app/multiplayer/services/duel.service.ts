import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class DuelService {
  private queueEvents: QueueEvents;
  constructor(@InjectQueue('duel') private readonly duelQueue: Queue) {}

  async startDuel() {
    const job = await this.duelQueue.add('start-duel', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async handlePlayerMove() {
    const job = await this.duelQueue.add('player-move', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
