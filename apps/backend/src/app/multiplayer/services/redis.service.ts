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

  async getGameData() {
    return JSON.parse(await this.client.get('game:data'));
  }

  async getPlayerData(playerId: string) {
    return JSON.parse(await this.client.get(`player:${playerId}:data`));
  }

  async setGameData(data: any) {
    return this.client.set('game:data', JSON.stringify(data));
  }

  async setPlayerData(playerId: string, data: any) {
    return this.client.set(`player:${playerId}:data`, JSON.stringify(data));
  }
}
