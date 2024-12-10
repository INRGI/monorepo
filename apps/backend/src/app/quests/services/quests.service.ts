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

  /**
   * Adds a job to the quest queue to create a new quest.
   * @param createQuestDto - The object containing the data for the new quest.
   * @returns A promise that resolves to the newly created Quest entity.
   */
  async createQuest(createQuestDto: CreateQuestDto) {
    const job = await this.questsQueue.add('create-quest', {createQuestDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  /**
   * Updates a quest with the specified id.
   * @param updateQuestDto - The object containing the updated quest data.
   * @returns A promise that resolves to the updated Quest entity.
   */
  async updateQuest(updateQuestDto: UpdateQuestDto) {
    const job = await this.questsQueue.add('update-quest', {updateQuestDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  /**
   * Deletes a quest with the specified id.
   * @param id - The id of the quest to be deleted.
   * @returns A promise that resolves to a string indicating that the quest was deleted successfully.
   */
  async deleteQuest(id: number) {
    const job = await this.questsQueue.add('delete-quest', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  /**
   * Retrieve all quests for a hero.
   * @param heroId - the id of the hero.
   * @returns a promise that resolves to an array of HeroQuest entities.
   */
  async getAllQuest(heroId: string) {
    const job = await this.questsQueue.add('get-all-quests', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
  /**
   * Update the status of a hero's quest.
   * @param updateStatusDto - the object containing the id of the quest and the hero,
   *                          and the boolean indicating whether the quest is completed.
   * @returns a promise that resolves to the updated HeroQuest entity.
   */
  async updateStatus(updateStatusDto: StatusUpdateDto) {
    const job = await this.questsQueue.add('update-status-hero-quest', {updateStatusDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
