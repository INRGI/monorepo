import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreateQuestDto } from '../dtos/CreateQuest.dto';
import { UpdateQuestDto } from '../dtos/UpdateQuest.dto';
import { StatusUpdateDto } from '../dtos/StatusUpdate.dto';

@Injectable()
export class QuestsService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('quests') private readonly questsQueue: Queue) {
    this.queueEvents = new QueueEvents('quests');
  }

  async createQuest(createQuestDto: CreateQuestDto) {
    const job = await this.questsQueue.add('create-quest', {createQuestDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async updateQuest(updateQuestDto: UpdateQuestDto) {
    const job = await this.questsQueue.add('update-quest', {updateQuestDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async deleteQuest(id: number) {
    const job = await this.questsQueue.add('delete-quest', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async getAllQuest(heroId: string) {
    const job = await this.questsQueue.add('get-all-quests', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  async updateStatus(updateStatusDto: StatusUpdateDto) {
    const job = await this.questsQueue.add('update-status-hero-quest', {updateStatusDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
