import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { RedisService } from '../services/redis.service';
import { CreateRoomDto } from '../dtos/CreateRoom.dto';
import { Inject, Type } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PvpRoom } from '../entities/PvpRoom.entity';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';
import { ChooseTypeDto } from '../dtos/ChooseType.dto';
import { Server } from 'socket.io';

@Processor('pvp')
export class PvpProcessor extends WorkerHost {
  private server: Server;

  constructor(
    private readonly redisService: RedisService,
    private readonly heroService: HeroService,
    @Inject('PVP_ROOM_REPOSITORY')
    private readonly pvpRoomRepository: Repository<PvpRoom>
  ) {
    super();
  }

  setServer(server: Server) {
    this.server = server;
  }

  async process(job: Job<any, any, string>): Promise<any> {
    try {
      switch (job.name) {
        case 'create-room':
          return await this.handleCreateRoomJob(job.data);
        case 'get-active':
          return await this.handleGetActiveJob();
        case 'delete-room':
          return await this.handleDeleteRoomJob(job.data);
        case 'join-room':
          return await this.handleJoinRoomJob(job.data);
        case 'start':
          return await this.handleStartJob(job.data);
        case 'conside':
          return await this.handleConsideJob(job.data);
        case 'choose-type':
          return await this.handleChooseType(job.data);
        default:
          throw new Error(`Unknown job name: ${job.name}`);
      }
    } catch (error) {
      console.error(`Error processing job ${job.name}:`, error);
      throw error;
    }
  }

  async handleCreateRoomJob(data: CreateRoomDto): Promise<PvpRoom> {
    const { heroId, heroName, betAmount } = data;
    await this.heroService.spendCoins(heroId as unknown as Types.ObjectId, betAmount);

    const newRoom = this.pvpRoomRepository.create({
      creatorHeroId: heroId,
      heroName,
      betAmount,
    });
    await this.handleJoinRoomJob({ roomId: String(newRoom.id), heroId });
    return await this.pvpRoomRepository.save(newRoom);
  }

  async handleGetActiveJob(): Promise<PvpRoom[]> {
    const rooms = await this.pvpRoomRepository.find();
    return rooms.filter((room) => !room.oponentHeroId);
  }

  async handleDeleteRoomJob(data: { id: number }): Promise<string> {
    const { id } = data;
    await this.pvpRoomRepository.delete(id);
    return 'Room deleted successfully';
  }

  async handleJoinRoomJob(data: { roomId: string; heroId: string }): Promise<PvpRoom | null> {
    const { roomId, heroId } = data;
    const room = await this.pvpRoomRepository.findOne({ where: { id: Number(roomId) } });
    
    if (!room) return null;
    if (room.creatorHeroId === heroId) return room;

    await this.heroService.spendCoins(heroId as unknown as Types.ObjectId, room.betAmount);
    room.oponentHeroId = heroId;
    return await this.pvpRoomRepository.save(room);
  }

  async handleStartJob(data: { roomId: string }): Promise<boolean> {
    const { roomId } = data;
    const room = await this.pvpRoomRepository.findOne({ where: { id: Number(roomId) } });
    return !!(room?.creatorHeroId && room.oponentHeroId);
  }

  async handleConsideJob(data: { roomId: string; heroId: string }) {
    const { roomId, heroId } = data;
    const room = await this.pvpRoomRepository.findOne({ where: { id: Number(roomId) } });

    if (room) {
      const winnerId = room.creatorHeroId === heroId ? room.oponentHeroId : room.creatorHeroId;
      await this.heroService.earnCoins(winnerId as unknown as Types.ObjectId, room.betAmount * 2);
      await this.handleDeleteRoomJob({ id: Number(roomId) });
    }
  }

  async handleChooseType(data: ChooseTypeDto) {
    const { heroId, roomId, chosenType } = data;

    await this.redisService.setPlayerChoice(String(roomId), heroId, chosenType);
    const room = await this.pvpRoomRepository.findOne({ where: { id: Number(roomId) } });
    if (!room || !room.oponentHeroId) return;

    const creatorChoice = await this.redisService.getPlayerChoice(String(roomId), room.creatorHeroId);
    const opponentChoice = await this.redisService.getPlayerChoice(String(roomId), room.oponentHeroId);

    if (creatorChoice && opponentChoice) {
      const result = this.determineWinner(creatorChoice, opponentChoice);
      await this.redisService.clearChoices(String(roomId));

      const winnerId = result === 'creator' ? room.creatorHeroId : room.oponentHeroId;
      await this.heroService.earnCoins(winnerId as unknown as Types.ObjectId, room.betAmount * 2);

      this.server.to(String(roomId)).emit('roundResult', { winner: result });
    }
  }

  determineWinner(creatorChoice: string, opponentChoice: string): 'creator' | 'opponent' | 'tie' {
    if (creatorChoice === opponentChoice) return 'tie';
    if (
      (creatorChoice === 'SHIELD' && opponentChoice === 'ATTACK') ||
      (creatorChoice === 'ATTACK' && opponentChoice === 'DODGE') ||
      (creatorChoice === 'DODGE' && opponentChoice === 'SHIELD')
    ) {
      return 'creator';
    }
    return 'opponent';
  }
}
