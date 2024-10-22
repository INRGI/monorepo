import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreateGuildDto } from '../dtos/CreateGuild.dto';
import { UpdateGuildDto } from '../dtos/UpdateGuild.dto';
import { InviteToGuildDto } from '../dtos/InviteToGuild.dto';
import { RemoveFromGuildDto } from '../dtos/RemoveFromGuild.dto';

@Injectable()
export class GuildService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('guild') private readonly guildQueue: Queue) {
    this.queueEvents = new QueueEvents('guild');
  }

  async createGuild(createGuildDto: CreateGuildDto) {
    const job = await this.guildQueue.add('create', {createGuildDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async updateGuild(updateGuildDto: UpdateGuildDto) {
    const job = await this.guildQueue.add('update', {updateGuildDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getGuildById(id: number) {
    const job = await this.guildQueue.add('get-one', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getGuilds() {
    const job = await this.guildQueue.add('get-all', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async inviteToGuild(inviteToGuildDto: InviteToGuildDto) {
    const job = await this.guildQueue.add('invite', {inviteToGuildDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async removeFromGuild(removeFromGuildDto: RemoveFromGuildDto) {
    const job = await this.guildQueue.add('remove', {removeFromGuildDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async deleteGuild(id: number) {
    const job = await this.guildQueue.add('delete', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
