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
  async getAllEnchants(): Promise<Enchant[]> {
    return await this.enchantService.findAllEnchants();
  }

  @Get(':id')
  async getEnchantById(@Param('id', ParseIntPipe) id: number): Promise<Enchant> {
    return await this.enchantService.getEnchantById(id);
  }

  @Post()
  createEnchant(@Body(ValidationPipe) enchantData: CreateEnchantDto): Promise<Enchant> {
    return this.enchantService.createEnchant(enchantData);
  }

  @Post('reenchant')
  reenchantItem(@Body(ValidationPipe) data: ReenchantDto): Promise<Item> {
    return this.enchantService.reenchantItem(data);
  }

  @Put(':id')
  updateEnchant(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) enchantData: UpdateEnchantDto
  ): Promise<Enchant> {
    return this.enchantService.updateEnchant(id, enchantData);
  }

  @Delete(':id')
  deleteEnchant(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.enchantService.deleteEnchant(id);
  }
}
