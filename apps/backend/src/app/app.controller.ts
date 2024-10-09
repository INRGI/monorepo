import { Body, Controller, Get, Post, Delete, Put, Param } from '@nestjs/common';
import { ItemService } from './loot/services/item.service';
import { Item } from './loot/entities/item.entity';
import { ItemBoxService } from './loot/services/itemBox.service';
import { ItemBox } from './loot/entities/itemBox.entity';
import { CreateItemDto } from './loot/dtos/CreateItem.dto';
import { CreateItemBoxDto } from './loot/dtos/CreateItemBox.dto';
import { UpdateItemBoxDto } from './loot/dtos/UpdateItemBox.dto';
import { DeleteItemBoxDto } from './loot/dtos/DeleteItemBox.dto';
import { DeleteItemDto } from './loot/dtos/DeleteItem.dto';
import { UpdateItemDto } from './loot/dtos/UpdateItem.dto';

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

    @Delete('item/:id')
    deleteItem(@Param() itemId:  DeleteItemDto): Promise<string> {
      return this.itemService.delete(itemId);
    }

    @Put('item')
    updateItem(@Body() itemData: UpdateItemDto): Promise<Partial<Item>> {
      return this.itemService.update(itemData);
    }

    @Get('itemBox')
    async getItemBox(){
      return await this.itemBoxService.findAll();
    }

    @Post('itemBox')
    createItemBox(@Body() itemBox:  CreateItemBoxDto): Promise<ItemBox> {
      return this.itemBoxService.create(itemBox);
    }

    @Delete('itemBox/:id')
    deleteItemBox(@Param() itemBoxId:  DeleteItemBoxDto): Promise<string> {
      return this.itemBoxService.delete(itemBoxId);
    }

    @Put('itemBox')
    updateItemBox(@Body() itemBoxData: UpdateItemBoxDto): Promise<Partial<ItemBox>> {
      return this.itemBoxService.update(itemBoxData);
    }
}
