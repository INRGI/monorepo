import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from './redis.service';

@Processor('chat')
export class ChatProcessor extends WorkerHost {
  constructor(private readonly redisService: RedisService) {
    super();
  }

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
