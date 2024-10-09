import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ItemService } from "../services/item.service";
import { CreateItemDto } from "../dtos/CreateItem.dto";
import { Item } from "../entities/item.entity";
import { DeleteItemDto } from "../dtos/DeleteItem.dto";
import { UpdateItemDto } from "../dtos/UpdateItem.dto";

@Controller('item')
export class ItemController {
  constructor(
    private readonly itemService: ItemService,
  ) {}
    @Get()
    async getItem(){
      return await this.itemService.findAll();
    }

    @Post()
    create(@Body() item: CreateItemDto): Promise<Partial<Item>> {
      return this.itemService.create(item);
    }

    @Delete(':id')
    deleteItem(@Param() itemId:  DeleteItemDto): Promise<string> {
      return this.itemService.delete(itemId);
    }

    @Put()
    updateItem(@Body() itemData: UpdateItemDto): Promise<Partial<Item>> {
      return this.itemService.update(itemData);
    }
}
