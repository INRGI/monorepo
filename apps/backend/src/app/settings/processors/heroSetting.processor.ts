import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { HeroSetting } from '../entities/heroSetting.entity';
import { UpdateHeroSettingDto } from '../dtos/updateHeroSetting.dto';

@Processor('heroSetting')
export class HeroSettingProcessor extends WorkerHost {
  constructor(
    @Inject('HERO_SETTING_REPOSITORY')
    private readonly heroSettingRepository: Repository<HeroSetting>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'get-hero-setting': {
        return await this.handleGetHeroSettingJob(job.data);
      }
      case 'update-hero-setting': {
        return await this.handleUpdateHeroSettingJob(job.data);
      }
    }
  }

  private async handleGetHeroSettingJob(data: { heroId: string }) {
    const { heroId } = data;

    const heroSetting = await this.heroSettingRepository.findOne({
      where: { heroId },
    });

    if (!heroSetting) {
      const setting = await this.createHeroSetting(heroId);

      return setting;
    }

    return heroSetting;
  }

  private async handleUpdateHeroSettingJob(data: UpdateHeroSettingDto) {
    const { heroId, hero3DModel } = data;

    const heroSetting = await this.heroSettingRepository.findOne({
      where: { heroId },
    });

    if (!heroSetting) throw new Error('Hero setting not found');

    heroSetting.hero3DModel = hero3DModel;
    return await this.heroSettingRepository.save(heroSetting);
  }

  private async createHeroSetting(heroId: string): Promise<HeroSetting> {
    const heroSetting = await this.heroSettingRepository.create({ heroId, models: ['woman', 'man', 'fun'], hero3DModel: 'woman' });
    return await this.heroSettingRepository.save(heroSetting);
  }
}
