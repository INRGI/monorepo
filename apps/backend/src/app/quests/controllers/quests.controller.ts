import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { QuestsService } from "../services/quests.service";
import { CreateQuestDto } from "../dtos/CreateQuest.dto";
import { UpdateQuestDto } from "../dtos/UpdateQuest.dto";
import { StatusUpdateDto } from "../dtos/StatusUpdate.dto";
import { Quests } from "../entities/quests.entity";
import { HeroQuest } from "../entities/heroQuest.entity";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('quests')
@UseInterceptors(CacheInterceptor)
export class QuestsController {
    constructor(private readonly questsService: QuestsService){}

    @Post()
    async createQuest(@Body(ValidationPipe) createQuestDto: CreateQuestDto):Promise<Quests> {
        return await this.questsService.createQuest(createQuestDto);
    }

    @Put()
    async updateQuest(@Body(ValidationPipe) updateQuestDto: UpdateQuestDto):Promise<Quests> {
        return await this.questsService.updateQuest(updateQuestDto);
    }

    @Delete(':id')
    async deleteQuest(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.questsService.deleteQuest(id);
    }

    @Get(':id')
    async getAllQuest(@Param('id') heroId: string):Promise<HeroQuest[]> {
        return await this.questsService.getAllQuest(heroId);
    }

    @Put('status')
    async updateStatus(@Body(ValidationPipe) updateStatusDto: StatusUpdateDto):Promise<HeroQuest> {
        return await this.questsService.updateStatus(updateStatusDto);
    }
}