import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

@Injectable()
export class DuelService {
  private queueEvents: QueueEvents;
  constructor(@InjectQueue('duel') private readonly duelQueue: Queue) {}

  /**
   * Starts a duel job in the queue and waits for it to finish, returning the result.
   *
   * The result will be an object with the following properties:
   * - `player1Id`: The ID of the first player to play.
   * - `player2Id`: The ID of the second player to play.
   * - `status`: The status of the duel (either 'waiting' or 'in-progress').
   */
  async startDuel() {
    const job = await this.duelQueue.add('start-duel', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  /**
   * Handles a player making a move in a duel.
   *
   * This adds a job to the queue with the name 'player-move' and waits for it to finish, returning the result.
   *
   * The result will be an object with the following properties:
   * - `player1Id`: The ID of the first player to play.
   * - `player2Id`: The ID of the second player to play.
   * - `status`: The status of the duel (either 'waiting' or 'in-progress').
   */
  async handlePlayerMove() {
    const job = await this.duelQueue.add('player-move', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
