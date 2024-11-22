import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from './redis.service';

@Processor('chat')
export class ChatProcessor extends WorkerHost {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  /**
   * Handles jobs that are sent to the chat queue.
   * 
   * Currently, there is only one job type, which is 'send-message'.
   * 
   * @param job The job that contains the data for the message to be sent.
   * 
   * @returns A promise that resolves when the job has been processed.
   */
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-message': {
        const { roomId, senderId, message } = job.data;
        await this.redisService.saveMessage(roomId, senderId, message);
        break;
      }
    }
  }
}
