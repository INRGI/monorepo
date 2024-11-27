import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { GuildService } from '../services/guild.service';
import { Guild } from '../entities/guild.entity';
import { CreateGuildDto } from '../dtos/CreateGuild.dto';
import { UpdateGuildDto } from '../dtos/UpdateGuild.dto';
import { InviteToGuildDto } from '../dtos/InviteToGuild.dto';
import { RemoveFromGuildDto } from '../dtos/RemoveFromGuild.dto';

@Controller('guild')
export class GuildController {
  constructor(private readonly guildService: GuildService) {}

  @Get()
  async getAllGuilds(): Promise<Guild[]> {
    return await this.guildService.getGuilds();
  }

  @Get(':id')
  async getGuild(@Param('id', ParseIntPipe) id: number): Promise<Guild> {
    return await this.guildService.getGuildById(id);
  }

  @Get('my/:heroId')
  async getMyGuild(@Param('heroId') heroId: string) {
    return await this.guildService.getMyGuild(heroId);
  }

  @Get('heroes')
  async getAllHeroes(){
    return await this.guildService.getHeroesWithoutGuild();
  }

  @Post()
  async createGuild(@Body(ValidationPipe) guildData: CreateGuildDto): Promise<Guild> {
    return await this.guildService.createGuild(guildData);
  }

  @Put('update')
  async updateGuild(@Body(ValidationPipe) guildData: UpdateGuildDto): Promise<Guild> {
    return await this.guildService.updateGuild(guildData);
  }

  @Post('invite')
  async inviteToGuild(@Body(ValidationPipe) inviteData: InviteToGuildDto): Promise<Guild> {
    return await this.guildService.inviteToGuild(inviteData);
  }

  @Post('remove')
  async removeFromGuild(
    @Body(ValidationPipe) removeData: RemoveFromGuildDto
  ): Promise<Guild> {
    return await this.guildService.removeFromGuild(removeData);
  }

  @Delete(':id')
  async deleteGuild(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.guildService.deleteGuild(id);
  }
}
