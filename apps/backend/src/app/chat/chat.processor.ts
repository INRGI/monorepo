
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from './redis.service';

@Processor('chat')
export class ChatProcessor extends WorkerHost {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async process(job: Job<any>): Promise<void> {
    const { roomId, senderId, message } = job.data;
    const client = await this.redisService.getClient();
    await client.rpush(`chat:${roomId}`, `${senderId}: ${message}`);
  }
}