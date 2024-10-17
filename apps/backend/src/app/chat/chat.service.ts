import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ChatService {
  constructor(@InjectQueue('chat') private readonly chatQueue: Queue) {}

  async sendMessage(roomId: string, senderId: string, message: string) {
    this.chatQueue.add('send-message', { roomId, senderId, message });
  }
}
