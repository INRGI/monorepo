import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { CreateSkillDto } from '../dtos/CreateSkill.dto';
import { UpdateSkillDto } from '../dtos/UpdateSkill.dto';
import { LevelUpSkillDto } from '../dtos/LevelUpSkill.dto';
import { CastSkillDto } from '../dtos/CastSkill.dto';

@Injectable()
export class SkillsService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('skills') private readonly skillsQueue: Queue) {
    this.queueEvents = new QueueEvents('skills');
  }

  async createSkill(createSkillDto: CreateSkillDto) {
    const job = await this.skillsQueue.add('create-skill', {createSkillDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async updateSkill(updateSkillDto: UpdateSkillDto) {
    const job = await this.skillsQueue.add('update-skill', {updateSkillDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async deleteSkill(skillId: number) {
    const job = await this.skillsQueue.add('delete-skill', {skillId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getAllSkills(heroId: string) {
    const job = await this.skillsQueue.add('get-all-skills', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getMySkills(heroId: string) {
    const job = await this.skillsQueue.add('get-my-skills', {heroId});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async levelUpSkill(levelUpSkillDto:LevelUpSkillDto) {
    const job = await this.skillsQueue.add('level-up-skill', {levelUpSkillDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async castSkill(castSkillDto: CastSkillDto){
    const job = await this.skillsQueue.add('cast-skill', {castSkillDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
