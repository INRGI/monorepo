import { Body, Controller, Get, Post } from '@nestjs/common';
import { ItemService } from './loot/services/item.service';
import { Item } from './loot/entities/item.entity';
import { ItemBoxService } from './loot/services/itemBox.service';
import { ItemBox } from './loot/entities/itemBox.entity';
import { InsertResult } from 'typeorm';
import { CreateItemDto } from './loot/dtos/CreateItem.dto';
import { CreateItemBoxDto } from './loot/dtos/CreateItemBox.dto';

@Controller()
export class AppController {
  constructor(
    private readonly itemService: ItemService,
    private readonly itemBoxService: ItemBoxService
  ) {}
    @Get('item')
    async getItem(){
      return await this.itemService.findAll();
    }

    @Post('item')
    create(@Body() item: CreateItemDto): Promise<Partial<Item>> {
      return this.itemService.create(item);
    }

    @Get('itemBox')
    async getItemBox(){
      return await this.itemBoxService.findAll();
    }

    @Post('itemBox')
    createBox(@Body() itemBox:  CreateItemBoxDto): Promise<ItemBox> {
      return this.itemBoxService.create(itemBox);
    }
}
