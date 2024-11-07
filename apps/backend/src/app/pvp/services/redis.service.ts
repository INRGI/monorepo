import { Injectable, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  getClient(): Redis {
    return this.client;
  }

  async setPlayerChoice(roomId: string, heroId: string, choice: string): Promise<void> {
    await this.client.set(`${roomId}:${heroId}:choice`, choice);
  }

  async getPlayerChoice(roomId: string, heroId: string): Promise<string | null> {
    return await this.client.get(`${roomId}:${heroId}:choice`);
  }

  async clearChoices(roomId: string): Promise<void> {
    await this.client.del(`${roomId}:*`);
  }
}
