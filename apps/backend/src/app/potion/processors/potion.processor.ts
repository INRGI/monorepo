import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Potion } from '../entities/potion.entity';
import { HeroPotion } from '../entities/hero-potion.entity';
import { Job } from 'bullmq';
import { CreatePotionDto } from '../dtos/createPotion.dto';
import { ActivatePotionDto } from '../dtos/activatePotion.dto';
import { Types } from 'mongoose';

@Processor('potion')
export class PotionProcessor extends WorkerHost {
  constructor(
    @Inject('POTION_REPOSITORY')
    private potionRepository: Repository<Potion>,
    @Inject('HERO_POTION_REPOSITORY')
    private heroPotionRepository: Repository<HeroPotion>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'get-all-potions': {
        return await this.handleGetAllPotionJob();
      }
      case 'create': {
        return await this.handleCreateaPotionJob(job.data);
      }
      case 'add': {
        return await this.handleAddToHeroJob(job.data);
      }
      case 'activate': {
        return await this.handleActivatePotionJob(job.data);
      }
      case 'get-heroes': {
        return await this.handleGetHeroesPotions(job.data);
      }
      case 'delete-after-timeout': {
        return await this.handleDeleteAfterTimeoutJob(job.data);
      }
    }
  }

  async handleGetAllPotionJob() {
    return await this.potionRepository.find();
  }

  async handleCreateaPotionJob(data: CreatePotionDto) {
    const potion = this.potionRepository.create(data);

    await this.handleAddToHeroJob({
      potionId: potion.id,
      heroId: '6706a007146bb8469d1bc0d4',
    });
    return await this.potionRepository.save(potion);
  }

  async handleAddToHeroJob(data: { potionId: number; heroId: string }) {
    const potion = await this.potionRepository.findOne({
      where: { id: data.potionId },
    });

    const heroPotion = this.heroPotionRepository.create({
      heroId: data.heroId,
      potion,
    });

    return await this.heroPotionRepository.save(heroPotion);
  }

  async handleActivatePotionJob(data: ActivatePotionDto) {
    const heroPotion = await this.heroPotionRepository.findOne({
      where: {
        heroId: data.heroId,
        potion: { id: parseInt(data.potionId) },
      },
      relations: ['potion'],
    });

    heroPotion.activatedAt = new Date();
    await this.heroPotionRepository.save(heroPotion);

    return heroPotion;
  }

  async handleGetHeroesPotions(data: { heroId: string }) {
    return await this.heroPotionRepository.find({
      where: { heroId: data.heroId },
      relations: ['potion'],
    });
  }

  async handleDeleteAfterTimeoutJob(data: { heroPotionId: number }) {
    const heroPotion = await this.heroPotionRepository.findOne({
      where: { id: data.heroPotionId },
    });

    if (heroPotion) {
      await this.heroPotionRepository.delete({ id: heroPotion.id });
    }
  }
}
