import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ConflictException, HttpException, Inject, NotFoundException } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Guild } from '../entities/guild.entity';
import { CreateGuildDto } from '../dtos/CreateGuild.dto';
import { UpdateGuildDto } from '../dtos/UpdateGuild.dto';
import { InviteToGuildDto } from '../dtos/InviteToGuild.dto';
import { RemoveFromGuildDto } from '../dtos/RemoveFromGuild.dto';
import { GuildParticipant } from '../entities/guildParticipant.entity';

@Processor('guild')
export class GuildProcessor extends WorkerHost {
  constructor(
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
    }
  }

  private async handleCreateJob(data: {
    createGuildDto: CreateGuildDto;
  }): Promise<Guild | { error: string }> {
    const { createGuildDto } = data;
    const guild = await this.guildRepository.findOne({where: {name: createGuildDto.name}});
    if(guild) return {error: 'Guild already exists'}

    const newGuild = this.guildRepository.create(createGuildDto);
    return await this.guildRepository.save(newGuild);
  }

  private async handleUpdateJob(data: {
    updateGuildDto: UpdateGuildDto;
  }): Promise<Guild> {
    const { updateGuildDto } = data;
    await this.guildRepository.update(updateGuildDto.id, {
      name: updateGuildDto.name,
    });
    return await this.guildRepository.findOne({
      where: { id: updateGuildDto.id },
    });
  }

  private async handleGetOneJob(data: { id: number }): Promise<Guild> {
    const { id } = data;
    return await this.guildRepository
      .createQueryBuilder('Guild')
      .leftJoinAndSelect('Guild.guildParticipants', 'guildParticipants')
      .where('Guild.id = :id', { id: id })
      .getOne();
  }

  private async handleGetAllJob(): Promise<Guild[]> {
    return await this.guildRepository
      .createQueryBuilder('guild')
      .leftJoin('guild.guildParticipants', 'guildParticipants')
      .groupBy('guild.id')
      .getMany();
  }

  private async handleInviteJob(data: {
    inviteToGuildDto: InviteToGuildDto;
  }): Promise<Guild | { error: string }> {
    const { inviteToGuildDto } = data;
    const { id, heroId } = inviteToGuildDto;

    const guild = await this.guildRepository.findOne({where: {id}});
    if(!guild) return {error: 'Guild not found'};

    const participant = this.guildParticipantsRepository.create({heroId, guild});
    await this.guildParticipantsRepository.save(participant);

    guild.guildParticipants.push(participant);
    return await this.guildRepository.save(guild);
  }

  private async handleRemoveJob(data: {
    removeFromGuildDto: RemoveFromGuildDto;
  }): Promise<Guild | { error: string }> {
    const { removeFromGuildDto } = data;
    const { id, heroId } = removeFromGuildDto;

    const guild = await this.guildRepository.findOne({where: {id}});
    if(!guild) throw new NotFoundException('Guild not found');

    const participant = guild.guildParticipants.find(part => part.heroId === heroId);
    if (!participant) return {error: 'Participant not found'};

    await this.guildParticipantsRepository.delete(participant.id);
    guild.guildParticipants = guild.guildParticipants.filter(part => part.heroId !== participant.heroId);

    return await this.guildRepository.save(guild);
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
