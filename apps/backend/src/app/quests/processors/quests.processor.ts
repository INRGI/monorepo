import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Quests } from '../entities/quests.entity';
import { HeroQuest } from '../entities/heroQuest.entity';
import { CreateQuestDto } from '../dtos/CreateQuest.dto';
import { UpdateQuestDto } from '../dtos/UpdateQuest.dto';
import { StatusUpdateDto } from '../dtos/StatusUpdate.dto';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';

@Processor('quests')
export class QuestsProcessor extends WorkerHost {
  constructor(
    private readonly heroService: HeroService,
    @Inject('QUESTS_REPOSITORY')
    private readonly questsRepository: Repository<Quests>,
    @Inject('HERO_QUEST_REPOSITORY')
    private readonly heroQuestRepository: Repository<HeroQuest>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'create-quest': {
        return await this.handleCreateQuest(job.data);
      }
      case 'update-quest': {
        return await this.handleUpdateQuest(job.data);
      }
      case 'delete-quest': {
        return await this.handleDeleteQuest(job.data);
      }
      case 'get-all-quests': {
        return await this.handleGetAllQuests(job.data);
      }
      case 'update-status-hero-quest': {
        return await this.handleUpdateStatus(job.data);
      }
      case 'complete-quest': {
        return await this.handleCompleteQuestJob(job.data);
      }
    }
  }

  private async handleCompleteQuestJob(data: { heroId: string, type: string }) {
    const { heroId, type } = data;

    const activeQuests = await this.heroQuestRepository.find({
      where: { heroId, isCompleted: false },
      relations: ['quest'],
    });

    for (const heroQuest of activeQuests) {
      if (heroQuest.quest.taskType === type) {
        heroQuest.isCompleted = true;
        await this.heroService.earnCoins(
          heroId as unknown as Types.ObjectId,
          heroQuest.quest.rewardCoins
        );
        await this.heroQuestRepository.save(heroQuest);
      }
    }
  }

  private async handleCreateQuest(data: {
    createQuestDto: CreateQuestDto;
  }): Promise<Quests> {
    const { createQuestDto } = data;

    const newQuest = await this.questsRepository.create(createQuestDto);
    const savedQuest = await this.questsRepository.save(newQuest);

    return savedQuest;
  }

  private async handleUpdateQuest(data: {
    updateQuestDto: UpdateQuestDto;
  }): Promise<Quests> {
    const { updateQuestDto } = data;

    await this.questsRepository
      .createQueryBuilder()
      .update(Quests)
      .set(updateQuestDto)
      .where('id = :id', { id: updateQuestDto.id })
      .execute();

    const quest = await this.questsRepository.findOne({
      where: { id: updateQuestDto.id },
    });

    return quest;
  }

  private async handleDeleteQuest(data: { id: number }): Promise<string> {
    const { id } = data;

    await this.questsRepository
      .createQueryBuilder()
      .delete()
      .from(Quests)
      .where('id = :id', { id: id })
      .execute();

    return 'Quest deleted successfully';
  }

  private async handleGetAllQuests(data: {
    heroId: string;
  }): Promise<HeroQuest[]> {
    const { heroId } = data;

    const heroQuests = await this.heroQuestRepository.find({
      where: { heroId },
      relations: ['quest'],
    });

    const allQuests = await this.questsRepository.find();

    const existingsQuests = heroQuests.map((hq) => hq.quest.id);

    const newHeroQuests = [];

    for (const quest of allQuests) {
      if (!existingsQuests.includes(quest.id)) {
        const newQuest = this.heroQuestRepository.create({
          heroId,
          quest,
          isCompleted: false,
        });
        newHeroQuests.push(newQuest);
      }
    }
    if (newHeroQuests.length) {
      await this.heroQuestRepository.save(newHeroQuests);
    }

    return await this.heroQuestRepository.find({
      where: { heroId },
      relations: ['quest'],
    });
  }

  private async handleUpdateStatus(data: {
    updateStatusDto: StatusUpdateDto;
  }): Promise<HeroQuest> {
    const { updateStatusDto } = data;

    await this.heroQuestRepository
      .createQueryBuilder()
      .update(Quests)
      .set(updateStatusDto)
      .where('id = :id', { id: updateStatusDto.id })
      .execute();

    const quest = await this.heroQuestRepository.findOne({
      where: { id: updateStatusDto.id },
    });

    if (updateStatusDto.isCompleted)
      await this.heroService.earnCoins(
        quest.heroId as unknown as Types.ObjectId,
        quest.quest.rewardCoins
      );

    return quest;
  }
}
