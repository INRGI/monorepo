import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ItemBoxService } from '../services/itemBox.service';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';
import { ItemBox } from '../entities/itemBox.entity';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';
import { UpdateItemBoxDto } from '../dtos/UpdateItemBox.dto';

@Controller('itemBox')
export class ItemBoxController {
  constructor(private readonly itemBoxService: ItemBoxService) {}

  @Get()
  async getItemBox() {
    return await this.itemBoxService.findAll();
  }

  @Get('one/:id')
  async getOneItemBox(@Param() itemBoxId: DeleteItemBoxDto) {
    return await this.itemBoxService.getOne(itemBoxId);
  }

  @Get(':id')
  async getRandomItemInABox(@Param() itemBoxId: DeleteItemBoxDto){
    return await this.itemBoxService.randomItemInABox(itemBoxId);
  }

  @Post()
  async createItemBox(@Body() itemBox: CreateItemBoxDto): Promise<ItemBox> {
    return await this.itemBoxService.create(itemBox);
  }

  @Delete(':id')
  async deleteItemBox(@Param() itemBoxId: DeleteItemBoxDto): Promise<string> {
    return await this.itemBoxService.delete(itemBoxId);
  }

  @Put()
  async updateItemBox(
    @Body() itemBoxData: UpdateItemBoxDto
  ): Promise<Partial<ItemBox>> {
    return await this.itemBoxService.update(itemBoxData);
  }
}
