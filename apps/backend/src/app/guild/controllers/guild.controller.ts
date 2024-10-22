import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { GuildService } from "../services/guild.service";
import { Guild } from "../entities/guild.entity";
import { CreateGuildDto } from "../dtos/CreateGuild.dto";
import { UpdateGuildDto } from "../dtos/UpdateGuild.dto";
import { InviteToGuildDto } from "../dtos/InviteToGuild.dto";
import { RemoveFromGuildDto } from "../dtos/RemoveFromGuild.dto";

@Controller('guild')
export class GuildController {
    constructor(private readonly guildService: GuildService){}

    @Get()
    async getAllGuilds():Promise<Guild[]>{
        return await this.guildService.getGuilds();
    }

    @Get(':id')
    async getGuild(@Param('id') id: number):Promise<Guild>{
        return await this.guildService.getGuildById(id);
    }

    @Post()
    async createGuild(@Body() guildData: CreateGuildDto): Promise<Guild>{
        return await this.guildService.createGuild(guildData);
    }

    @Put()
    async updateGuild(@Body() guildData: UpdateGuildDto):Promise<Guild>{
        return await this.updateGuild(guildData);
    }

    @Post('invite')
    async inviteToGuild(@Body() inviteData: InviteToGuildDto): Promise<Guild>{
        return await this.guildService.inviteToGuild(inviteData);
    }

    @Post('remove')
    async removeFromGuild(@Body() removeData: RemoveFromGuildDto):Promise<Guild>{
        return await this.guildService.removeFromGuild(removeData);
    }

    @Delete(':id')
    async deleteGuild(@Param('id') id: number): Promise<string>{
        return this.guildService.deleteGuild(id);
    }
}