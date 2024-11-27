import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { PotionService } from './potion.service';
import { CreatePotionDto } from './dtos/createPotion.dto';
import { ActivatePotionDto } from './dtos/activatePotion.dto';

@Controller('potion')
export class PotionController {
  constructor(private readonly potionService: PotionService) {}

  @Get('all')
  async getAllPotions() {
    return await this.potionService.getAllPotions();
  }

  @Post('create')
  async createPotion(@Body(ValidationPipe) createPotionDto: CreatePotionDto) {
    return await this.potionService.createPotion(createPotionDto);
  }

  @Put('activate')
  async activatePotion(@Body(ValidationPipe) activatePotionDto: ActivatePotionDto) {
    return await this.potionService.activatePotion(activatePotionDto);
  }

  @Get(':id')
  async getHeroesPotions( @Param('id') heroId: string,) {
    return await this.potionService.getHeroesPotions(heroId);
  }
}
