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
    this.chatQueue.add('send-message', {roomId, senderId, message});
  }
}

