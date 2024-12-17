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
import { EnchantService } from '../services/enchant.service';

import { Enchant } from '../entities/enchant.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';
import { Item } from '../entities/item.entity';
import { ReenchantDto } from '../dtos/Reenchant.dto';

@Controller('enchant')
export class EnchantController {
  constructor(private readonly enchantService: EnchantService) {}

  @Get()
  /**
   * Retrieves all enchantments.
   * @returns A promise that resolves to an array of `Enchant` objects.
   */
  async getAllEnchants(): Promise<Enchant[]> {
    return await this.enchantService.findAllEnchants();
  }

  @Get(':id')
  async getEnchantById(@Param('id', ParseIntPipe) id: number): Promise<Enchant> {
    return await this.enchantService.getEnchantById(id);
  }

  @Post()
/**
 * Creates a new enchantment.
 * @param enchantData The data for the enchantment to be created.
 * @returns A promise that resolves to the newly created `Enchant` object.
 */

  createEnchant(@Body(ValidationPipe) enchantData: CreateEnchantDto): Promise<Enchant> {
    return this.enchantService.createEnchant(enchantData);
  }

  @Post('reenchant')
  /**
   * Reenchants an item.
   * @param data The data to reenchant the item with.
   * @returns The reenchanted item.
   */
  reenchantItem(@Body(ValidationPipe) data: ReenchantDto): Promise<Item> {
    return this.enchantService.reenchantItem(data);
  }

  @Put(':id')
  /**
   * Updates an enchantment by its ID.
   * @param id The ID of the enchantment to update.
   * @param enchantData The data to update the enchantment with.
   * @returns A promise that resolves to the updated `Enchant` object.
   */
  updateEnchant(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) enchantData: UpdateEnchantDto
  ): Promise<Enchant> {
    return this.enchantService.updateEnchant(id, enchantData);
  }

  @Delete(':id')
/**
 * Deletes an enchantment by its ID.
 * @param id The ID of the enchantment to delete.
 * @returns A promise that resolves to a string indicating the success of the deletion.
 */

  deleteEnchant(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.enchantService.deleteEnchant(id);
  }
}
