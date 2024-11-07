import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreateRoomDto } from '../dtos/CreateRoom.dto';
import { ChooseTypeDto } from '../dtos/ChooseType.dto';

@Injectable()
export class PvpService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('pvp') private readonly pvpQueue: Queue) {
    this.queueEvents = new QueueEvents('pvp');
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const job = await this.pvpQueue.add('create-room', createRoomDto);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async deleteRoom(id: number) {
    const job = await this.pvpQueue.add('delete-room', { id });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async findAllRooms() {
    const job = await this.pvpQueue.add('get-active', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async joinRoom(payload: { roomId: string; heroId: string }) {
    const job = await this.pvpQueue.add('join-room', payload);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async start(payload: {roomId: string}) {
    const job = await this.pvpQueue.add('start', payload);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async conside(payload: { roomId: string; heroId: string }) {
    const job = await this.pvpQueue.add('conside', payload);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async chooseType(payload: ChooseTypeDto) {
    const job = await this.pvpQueue.add('choose-type', payload);
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
