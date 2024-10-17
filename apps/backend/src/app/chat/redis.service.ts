import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  async saveMessage(roomId: string, senderId: string, message: string) {
    await this.client.rpush(`chat:${roomId}`, `${senderId}: ${message}`);
  }

  getClient(): Redis {
    return this.client;
  }
}
