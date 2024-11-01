import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { GuildBossService } from '../services/guildBoss.service';
import { CreateGuildBossDto } from '../dtos/CreateGuildBoss.dto';
import { GuildBoss } from '../entities/guildBoss.entity';
import { UpdateGuildBossDto } from '../dtos/UpdateGuildBoss.dto';
import { Guild } from '../entities/guild.entity';

@Controller('guild-boss')
export class GuildBossController {
  constructor(private readonly guildBossService: GuildBossService) {}

  @Post()
  async create(
    @Body() createGuildBossDto: CreateGuildBossDto
  ): Promise<GuildBoss> {
    return await this.guildBossService.create(createGuildBossDto);
  }

  @Put()
  async update(
    @Body() updateGuildBossDto: UpdateGuildBossDto
  ): Promise<GuildBoss> {
    return await this.guildBossService.update(updateGuildBossDto);
  }

  @Delete(':id')
  async delete(@Param('id') guildBossId: number): Promise<string> {
    return await this.guildBossService.delete(guildBossId);
  }

  @Get()
  async getAll(): Promise<GuildBoss[]> {
    return await this.guildBossService.getAll();
  }

  @Get(':id')
  async getActive(@Param('id') guildId: number): Promise<GuildBoss> {
    return await this.guildBossService.getActive(guildId);
  }

  @Put('startIvent')
  async startIvent(
    @Body('guildBossId') guildBossId: number,
    @Body('guildId') guildId: number
  ): Promise<Guild> {
    return await this.guildBossService.startIvent(guildBossId, guildId);
  }

  @Put('leaveIvent')
  async leaveIvent(@Body('guildId') guildId: number): Promise<Guild> {
    return await this.guildBossService.leaveIvent(guildId);
  }

  @Put('attack')
  async attack(
    @Body('guildBossId') guildBossId: number,
    @Body('damage') damage: number,
    @Body('guildId') guildId: number,
    @Body('heroId') heroId: string
  ): Promise<GuildBoss | Guild> {
    return await this.guildBossService.attack(guildBossId, damage, guildId, heroId);
  }
}
