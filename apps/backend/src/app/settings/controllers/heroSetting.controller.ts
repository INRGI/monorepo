import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { HeroSettingService } from "../services/heroSetting.service";
import { UpdateHeroSettingDto } from "../dtos/updateHeroSetting.dto";

@Controller('heroSetting')
export class HeroSettingController {
    constructor(private readonly heroSettingService: HeroSettingService) {}

    @Get(':heroId')
    async getHeroSetting(@Param('heroId') heroId: string) {
        return await this.heroSettingService.getHeroSettingJob(heroId);
    }

    @Put()
    async updateHeroSetting(@Body() updateHeroSettingDto: UpdateHeroSettingDto) {
        return await this.heroSettingService.updateHeroSettingJob(updateHeroSettingDto);
    }
}