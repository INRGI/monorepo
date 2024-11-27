import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  ValidationPipe,
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

  @Get('top')
  async getTopBoxes(){
    return await this.itemBoxService.findTheMostExpensive();
  }

  @Get(':id')
  async getRandomItemInABox(@Param('id') itemBoxId: DeleteItemBoxDto){
    return await this.itemBoxService.randomItemInABox(itemBoxId);
  }

  @Post()
  async createItemBox(@Body(ValidationPipe) itemBox: CreateItemBoxDto): Promise<ItemBox> {
    return await this.itemBoxService.create(itemBox);
  }

  @Delete(':id')
  async deleteItemBox(@Param('id') itemBoxId: DeleteItemBoxDto): Promise<string> {
    return await this.itemBoxService.delete(itemBoxId);
  }

  @Put()
  async updateItemBox(
    @Body(ValidationPipe) itemBoxData: UpdateItemBoxDto
  ): Promise<Partial<ItemBox>> {
    return await this.itemBoxService.update(itemBoxData);
  }
}
