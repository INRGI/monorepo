import { Inject, Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RedisService } from './redis.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectQueue('chat') private readonly chatQueue: Queue,
    private readonly redisService: RedisService
  ) {}

  async sendMessage(roomId: string, senderId: string, message: string) {
    const client = await this.redisService.getClient();
    await client.rpush(`chat:${roomId}`, `${senderId}: ${message}`);
  }

  async getMessages(roomId: string) {
    const client = await this.redisService.getClient();
    const messages = await client.lrange(`chat:${roomId}`, 0, -1);
    return messages.map((msg: string) => {
      const [senderId, message] = msg.split(': ');
      return { senderId, message };
    });
  }
}

