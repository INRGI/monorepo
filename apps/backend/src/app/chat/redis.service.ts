import { Injectable, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  /**
   * Lifecycle hook, called after the module has finished initializing.
   *
   * Connects to the Redis server.
   */
  onModuleInit() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
    });
  }

  /**
   * Saves a message to the Redis list for a specific chat room.
   * 
   * @param roomId The ID of the room where the message is to be saved.
   * @param senderId The ID of the user sending the message.
   * @param message The content of the message.
   * 
   * The message is appended to a Redis list identified by the roomId,
   * with the format "senderId: message".
   */
  async saveMessage(roomId: string, senderId: string, message: string) {
    await this.client.rpush(`chat:${roomId}`, `${senderId}: ${message}`);
  }

  /**
   * Retrieves the Redis client instance.
   *
   * @returns The Redis client used for interacting with the Redis server.
   */
  getClient(): Redis {
    return this.client;
  }
}
