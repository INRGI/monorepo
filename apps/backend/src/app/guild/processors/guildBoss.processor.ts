import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { MoreThan, Repository } from 'typeorm';
import { GuildBoss } from '../entities/guildBoss.entity';
import { Guild } from '../entities/guild.entity';
import { CreateGuildBossDto } from '../dtos/CreateGuildBoss.dto';
import { UpdateGuildBossDto } from '../dtos/UpdateGuildBoss.dto';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';

@Processor('guild-boss')
export class GuildBossProcessor extends WorkerHost {
  constructor(
    @InjectQueue('skills') private readonly skillsQueue: Queue,
    private readonly heroService: HeroService,
    @Inject('GUILD_BOSS_REPOSITORY')
    private readonly guildBossRepository: Repository<GuildBoss>,
    @Inject('GUILD_REPOSITORY')
    private readonly guildRepository: Repository<Guild>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'create': {
        return await this.handleCreateJob(job.data);
      }
      case 'update': {
        return await this.handleUpdateJob(job.data);
      }
      case 'delete': {
        return await this.handleDeleteJob(job.data);
      }
      case 'get-all': {
        return await this.handleGetAllJob();
      }
      case 'get-active': {
        return await this.handleGetActiveJob(job.data);
      }
      case 'start-ivent': {
        return await this.handleStartIventJob(job.data);
      }
      case 'leave-ivent': {
        return await this.handleLeaveIventJob(job.data);
      }
      case 'attack': {
        return await this.handleAttackJob(job.data);
      }
    }
  }

  private async handleCreateJob(data: {
    createGuildBossDto: CreateGuildBossDto;
  }): Promise<GuildBoss> {
    const { createGuildBossDto } = data;

    const newBoss = await this.guildBossRepository.create(createGuildBossDto);
    return await this.guildBossRepository.save(newBoss);
  }

  private async handleUpdateJob(data: {
    updateGuildBossDto: UpdateGuildBossDto;
  }): Promise<GuildBoss> {
    const { updateGuildBossDto } = data;

    await this.guildBossRepository
      .createQueryBuilder()
      .update(GuildBoss)
      .set(updateGuildBossDto)
      .where('id = :id', { id: updateGuildBossDto.id })
      .execute();

    const boss = await this.guildBossRepository.findOne({
      where: { id: updateGuildBossDto.id },
    });

    return boss;
  }

  private async handleDeleteJob(data: {
    guildBossId: number;
  }): Promise<string> {
    const { guildBossId } = data;

    await this.guildBossRepository
      .createQueryBuilder()
      .delete()
      .from(GuildBoss)
      .where('id = :id', { id: guildBossId })
      .execute();

    return 'Deleted';
  }

  private async handleGetAllJob(): Promise<GuildBoss[]> {
    const bosses = await this.guildBossRepository.find({
      where: {
        health: MoreThan(0),
      },
    });

    return bosses;
  }

  private async handleGetActiveJob(data: {
    guildId: number;
  }): Promise<GuildBoss> {
    const { guildId } = data;

    const guild = await this.guildRepository.findOne({
      where: { id: guildId },
      relations: ['boss'],
    });

    return guild.boss;
  }

  private async handleStartIventJob(data: {
    guildBossId: number;
    guildId: number;
  }): Promise<Guild> {
    const { guildBossId, guildId } = data;

    const guild = await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoinAndSelect('guild.boss', 'boss')
      .where('guild.id = :guildId', { guildId })
      .getOne();

    if (guild.boss) return guild;

    const boss = await this.guildBossRepository.findOne({
      where: { id: guildBossId },
    });

    guild.boss = boss;
    await this.guildRepository.save(guild);

    return guild;
  }

  private async handleLeaveIventJob(data: { guildId: number }): Promise<Guild> {
    const { guildId } = data;

    const guild = await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoinAndSelect('guild.boss', 'boss')
      .where('guild.id = :guildId', { guildId })
      .getOne();

    guild.boss = null;

    await this.guildRepository.save(guild);
    return guild;
  }

  private async handleAttackJob(data: {
    guildBossId: number;
    damage: number;
    guildId: number;
    heroId: string;
  }): Promise<GuildBoss | Guild> {
    const { guildId, damage, guildBossId, heroId } = data;

    const guild = await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoinAndSelect('guild.boss', 'boss')
      .where('guild.id = :guildId', { guildId })
      .getOne();

    const hero = await this.heroService.findByUserId(
      heroId as unknown as Types.ObjectId
    );
    if (hero.hp <= 0) return guild.boss;

    guild.boss.health -= damage;

    const chance = Math.random();
    if (chance <= 0.1) {
      await this.heroService.minusHP(
        heroId as unknown as Types.ObjectId,
        guild.boss.attack
      );
    }

    if (guild.boss.health <= 0) {
      const guildParticipants = await this.guildRepository
        .createQueryBuilder('guild')
        .leftJoinAndSelect('guild.guildParticipants', 'guildParticipants')
        .where('guild.id = :guildId', { guildId })
        .getOne();

      if (guildParticipants) {
        await Promise.all(
          guildParticipants.guildParticipants.map(async (part) => {
            await this.heroService.earnCoins(
              part.heroId as unknown as Types.ObjectId,
              guild.boss.rewardCoins
            );
          })
        );

        await this.heroService.earnCoins(
          guildParticipants.guildMastersId as unknown as Types.ObjectId,
          guild.boss.rewardCoins
        );
      }

      guild.boss.health = 0;

      await this.guildBossRepository.save(guild.boss);
      guild.boss = null;
      await this.guildRepository.save(guild);
      return guild;
    }
    await this.guildRepository.save(guild);
    await this.guildBossRepository.save(guild.boss);
    await this.skillsQueue.add('reduce-cooldown', {
      heroId: heroId as unknown as Types.ObjectId,
    });

    return guild.boss;
  }
}
