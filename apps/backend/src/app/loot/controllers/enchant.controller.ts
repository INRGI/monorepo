import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
  async getAllEnchants(): Promise<Enchant[]> {
    return await this.enchantService.findAllEnchants();
  }

  @Get(':id')
  async getEnchantById(@Param('id') id: number): Promise<Enchant> {
    return await this.enchantService.getEnchantById(id);
  }

  @Post()
  createEnchant(@Body() enchantData: CreateEnchantDto): Promise<Enchant> {
    return this.enchantService.createEnchant(enchantData);
  }

  @Post('reenchant')
  reenchantItem(@Body() data: ReenchantDto): Promise<Item> {
    return this.enchantService.reenchantItem(data);
  }

  @Put(':id')
  updateEnchant(
    @Param('id') id: number,
    @Body() enchantData: UpdateEnchantDto
  ): Promise<Enchant> {
    return this.enchantService.updateEnchant(id, enchantData);
  }

  @Delete(':id')
  deleteEnchant(@Param('id') id: number): Promise<string> {
    return this.enchantService.deleteEnchant(id);
  }
}
