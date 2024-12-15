import { Body, Controller, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { PotionService } from './potion.service';
import { CreatePotionDto } from './dtos/createPotion.dto';
import { ActivatePotionDto } from './dtos/activatePotion.dto';

@Controller('potion')
export class PotionController {
  constructor(private readonly potionService: PotionService) {}

  @Get('all')
/**
 * Retrieves all potions from the potion service.
 * 
 * @returns A promise that resolves to an array of all potions.
 */
  async getAllPotions() {
    return await this.potionService.getAllPotions();
  }

  @Post('create')
  /**
   * Creates a new potion based on the data passed in the request body.
   * This is a protected route.
   * 
   * @param createPotionDto The data to create the potion with.
   * 
   * @returns A promise that resolves to the newly created potion.
   */
  async createPotion(@Body(ValidationPipe) createPotionDto: CreatePotionDto) {
    return await this.potionService.createPotion(createPotionDto);
  }

  @Put('activate')
  /**
   * Activates a potion based on the data passed in the request body.
   * 
   * @param activatePotionDto The data to activate the potion with.
   * 
   * @returns A promise that resolves to the activated potion.
   */
  async activatePotion(@Body(ValidationPipe) activatePotionDto: ActivatePotionDto) {
    return await this.potionService.activatePotion(activatePotionDto);
  }

  @Get(':id')
  /**
   * Retrieves all potions that belong to the hero with the given id.
   * 
   * @param id The id of the hero.
   * 
   * @returns A promise that resolves to an array of potions that belong to the hero.
   */
  async getHeroesPotions( @Param('id') heroId: string,) {
    return await this.potionService.getHeroesPotions(heroId);
  }
}
