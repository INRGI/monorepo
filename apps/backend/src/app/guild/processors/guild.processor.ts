import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Guild } from '../entities/guild.entity';
import { CreateGuildDto } from '../dtos/CreateGuild.dto';
import { UpdateGuildDto } from '../dtos/UpdateGuild.dto';
import { InviteToGuildDto } from '../dtos/InviteToGuild.dto';
import { RemoveFromGuildDto } from '../dtos/RemoveFromGuild.dto';
import { GuildParticipant } from '../entities/guildParticipant.entity';
import { HeroService } from '@org/users';

@Processor('guild')
export class GuildProcessor extends WorkerHost {
  constructor(
    private readonly heroService: HeroService,
    @Inject('GUILD_REPOSITORY')
    private readonly guildRepository: Repository<Guild>,
    @Inject('GUILD_PARTICIPANT_REPOSITORY')
    private readonly guildParticipantsRepository: Repository<GuildParticipant>
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
      case 'get-one': {
        return await this.handleGetOneJob(job.data);
      }
      case 'get-my': {
        return await this.handleGetMyJob(job.data);
      }
      case 'get-all': {
        return await this.handleGetAllJob();
      }
      case 'invite': {
        return await this.handleInviteJob(job.data);
      }
      case 'remove': {
        return await this.handleRemoveJob(job.data);
      }
      case 'delete': {
        return await this.handleDeleteJob(job.data);
      }
      case 'get-heroes': {
        return await this.handleGetHeroesJob();
      }
    }
  }

  private async handleGetHeroesJob() {
    const heroes = await this.heroService.findAll();
    const participants = await this.guildParticipantsRepository.find();

    const heroesWithoutGuild = heroes.filter(
      (hero) =>
        !participants.some((participant) => participant.heroId === hero.id)
    );

    return heroesWithoutGuild;
  }

  private async handleCreateJob(data: {
    createGuildDto: CreateGuildDto;
  }): Promise<Guild | { error: string }> {
    const { createGuildDto } = data;

    const existingParticipant = await this.guildParticipantsRepository.findOne({
      where: { heroId: createGuildDto.guildMastersId },
    });
    if (existingParticipant)
      return { error: 'You are already a member of a guild' };

    const guild = await this.guildRepository.findOne({
      where: { name: createGuildDto.name },
    });
    if (guild) return { error: 'Guild already exists' };

    const newGuild = await this.guildRepository.create(createGuildDto);

    newGuild.guildMastersId = createGuildDto.guildMastersId;
    const savedGuild = await this.guildRepository.save(newGuild);

    const participant = this.guildParticipantsRepository.create({
      heroId: createGuildDto.guildMastersId,
      guild: savedGuild,
    });
    await this.guildParticipantsRepository.save(participant);

    return savedGuild;
  }

  private async handleUpdateJob(data: {
    updateGuildDto: UpdateGuildDto;
  }): Promise<Guild | { error: string }> {
    const { updateGuildDto } = data;

    await this.guildRepository
      .createQueryBuilder()
      .update(Guild)
      .set(updateGuildDto)
      .where('id = :id', { id: updateGuildDto.id })
      .execute();

    const guild = await this.guildRepository.findOne({
      where: { id: updateGuildDto.id },
    });

    if (!guild) {
      return { error: 'Guild not found' };
    }

    return guild;
  }

  private async handleGetOneJob(data: {
    id: number;
  }): Promise<Guild | { error: string }> {
    const { id } = data;
    const guild = await this.guildRepository
      .createQueryBuilder('Guild')
      .leftJoinAndSelect('Guild.guildParticipants', 'guildParticipants')
      .where('Guild.id = :id', { id: id })
      .getOne();

    if (!guild) return { error: 'Guild not found' };

    const heroes = await this.heroService.findAll();

    guild.guildParticipants = guild.guildParticipants.map((participant) => {
      const hero = heroes.find((hero) => hero.id === participant.heroId);
      return {
        ...participant,
        hero,
      };
    });

    return guild;
  }

  private async handleGetAllJob(): Promise<Guild[]> {
    return await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoin('guild.guildParticipants', 'guildParticipants')
      .groupBy('guild.id')
      .getMany();
  }

  private async handleGetMyJob(data: {
    heroId: number;
  }): Promise<Guild | { error: string }> {
    const { heroId } = data;

    const guild = await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoinAndSelect('guild.guildParticipants', 'guildParticipants')
      .where(
        'guild.guildMastersId = :heroId OR guildParticipants.heroId = :heroId',
        { heroId }
      )
      .getOne();

    if (!guild) return { error: 'Guild not found' };
    return guild;
  }

  private async handleInviteJob(data: {
    inviteToGuildDto: InviteToGuildDto;
  }): Promise<Guild | { error: string }> {
    const { inviteToGuildDto } = data;
    const { id, heroId } = inviteToGuildDto;

    const existingParticipant = await this.guildParticipantsRepository.findOne({
      where: { heroId },
    });
    if (existingParticipant)
      return { error: 'You are already a member of a guild' };

    const guild = await this.guildRepository.findOne({ where: { id } });
    if (!guild) return { error: 'Guild not found' };

    const participant = this.guildParticipantsRepository.create({
      heroId,
      guild,
    });
    await this.guildParticipantsRepository.save(participant);

    guild.guildParticipants.push(participant);
    return await this.guildRepository.save(guild);
  }

  private async handleRemoveJob(data: {
    removeFromGuildDto: RemoveFromGuildDto;
  }): Promise<Guild | { error: string }> {
    const { removeFromGuildDto } = data;
    const { id, heroId } = removeFromGuildDto;

    const guild = await this.guildRepository.findOne({ where: { id } });
    if (!guild) throw new NotFoundException('Guild not found');

    await this.guildParticipantsRepository.delete({ heroId });

    return guild;
  }

  private async handleDeleteJob(data: { id: number }): Promise<string> {
    const { id } = data;
    await this.guildRepository
      .createQueryBuilder()
      .delete()
      .from(Guild)
      .where('id = :id', { id: id })
      .execute();
    return 'Guild deleted successfully';
  }
}
