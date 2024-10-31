import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreateGuildBossDto } from '../dtos/CreateGuildBoss.dto';
import { UpdateGuildBossDto } from '../dtos/UpdateGuildBoss.dto';

@Injectable()
export class GuildBossService {
  private queueEvents: QueueEvents;

  constructor(
    @InjectQueue('guild-boss') private readonly guildBossQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('guild-boss');
  }

  async create(createGuildBossDto: CreateGuildBossDto) {
    const job = await this.guildBossQueue.add('create', { createGuildBossDto });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async update(updateGuildBossDto: UpdateGuildBossDto) {
    const job = await this.guildBossQueue.add('update', { updateGuildBossDto });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async delete(guildBossId: number) {
    const job = await this.guildBossQueue.add('delete', { guildBossId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async getAll() {
    const job = await this.guildBossQueue.add('get-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async getActive(guildId: number) {
    const job = await this.guildBossQueue.add('get-active', { guildId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async startIvent(guildBossId: number, guildId: number) {
    const job = await this.guildBossQueue.add('start-ivent', { guildBossId, guildId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async leaveIvent(guildId: number) {
    const job = await this.guildBossQueue.add('leave-ivent', { guildId });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async attack(guildBossId: number, damage: number, guildId: number) {
    const job = await this.guildBossQueue.add('attack', {
      guildBossId,
      damage,
      guildId
    });
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
