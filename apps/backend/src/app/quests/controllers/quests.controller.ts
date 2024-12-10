import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { QuestsService } from "../services/quests.service";
import { CreateQuestDto } from "../dtos/CreateQuest.dto";
import { UpdateQuestDto } from "../dtos/UpdateQuest.dto";
import { StatusUpdateDto } from "../dtos/StatusUpdate.dto";
import { Quests } from "../entities/quests.entity";
import { HeroQuest } from "../entities/heroQuest.entity";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { RolesGuard } from "../../roles.guard";

@Controller('quests')
@UseGuards(RolesGuard)
@UseInterceptors(CacheInterceptor)
export class QuestsController {
    constructor(private readonly questsService: QuestsService){}

    @Post()
    /**
     * Creates a new quest with the given information.
     * @param createQuestDto The quest information.
     * @returns The newly created quest.
     */
    async createQuest(@Body(ValidationPipe) createQuestDto: CreateQuestDto):Promise<Quests> {
        return await this.questsService.createQuest(createQuestDto);
    }

    @Put()
    /**
     * Updates a quest with the given information.
     * @param updateQuestDto The quest information with the fields to be updated.
     * @returns The updated quest.
     */
    async updateQuest(@Body(ValidationPipe) updateQuestDto: UpdateQuestDto):Promise<Quests> {
        return await this.questsService.updateQuest(updateQuestDto);
    }

    @Delete(':id')
    /**
     * Deletes a quest with the given id.
     * @param id The id of the quest to be deleted.
     * @returns A string indicating that the quest was deleted successfully.
     */
    async deleteQuest(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.questsService.deleteQuest(id);
    }

    @Get(':id')
    /**
     * Retrieves all quests for the hero with the given id.
     * If the hero does not have a particular quest, it is created.
     * @param heroId The id of the hero
     * @returns All quests for the hero
     */
    async getAllQuest(@Param('id') heroId: string):Promise<HeroQuest[]> {
        return await this.questsService.getAllQuest(heroId);
    }

    @Put('status')
    /**
     * Updates the status of a hero's quest.
     * @param updateStatusDto The quest status information with the fields to be updated.
     * @returns The updated HeroQuest.
     */
    async updateStatus(@Body(ValidationPipe) updateStatusDto: StatusUpdateDto):Promise<HeroQuest> {
        return await this.questsService.updateStatus(updateStatusDto);
    }
}