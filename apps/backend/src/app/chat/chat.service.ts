import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ChatService {
  constructor(@InjectQueue('chat') private readonly chatQueue: Queue) {}

  /**
   * Add a job to the chat queue to send a message to a room.
   * @param roomId The ID of the room to send the message to.
   * @param senderId The ID of the user sending the message.
   * @param message The content of the message.
   */
  async sendMessage(roomId: string, senderId: string, message: string) {
    this.chatQueue.add('send-message', { roomId, senderId, message });
  }
}
