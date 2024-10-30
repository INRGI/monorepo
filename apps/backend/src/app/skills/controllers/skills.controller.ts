import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkillsService } from '../services/skills.service';
import { CreateSkillDto } from '../dtos/CreateSkill.dto';
import { Skills } from '../entities/skills.entity';
import { UpdateSkillDto } from '../dtos/UpdateSkill.dto';
import { LevelUpSkillDto } from '../dtos/LevelUpSkill.dto';
import { HeroSkill } from '../entities/heroSkill.entity';
import { CastSkillDto } from '../dtos/CastSkill.dto';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async createSkill(@Body() createSkillDto: CreateSkillDto): Promise<Skills> {
    return await this.skillsService.createSkill(createSkillDto);
  }

  @Put()
  async updateSkill(@Body() updateSkillDto: UpdateSkillDto): Promise<Skills> {
    return await this.skillsService.updateSkill(updateSkillDto);
  }

  @Delete(':id')
  async deleteSkill(@Param('id') skillId: number): Promise<string> {
    return await this.skillsService.deleteSkill(skillId);
  }

  @Get('all/:id')
  async getAllSkills(@Param('id') heroId: string): Promise<HeroSkill[]> {
    return await this.skillsService.getAllSkills(heroId);
  }

  @Get('my/:id')
  async getMySkills(@Param('id') heroId: string): Promise<HeroSkill[]> {
    return await this.skillsService.getMySkills(heroId);
  }

  @Put('levelUp')
  async levelUpSkill(
    @Body() levelUpSkillDto: LevelUpSkillDto
  ): Promise<HeroSkill> {
    return await this.skillsService.levelUpSkill(levelUpSkillDto);
  }

  @Put('cast')
  async castSkill (@Body() castSkillDto: CastSkillDto): Promise<HeroSkill>{
    return await this.skillsService.castSkill(castSkillDto);
  }
}
