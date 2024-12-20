import {
  Controller,
  Post,
  Param,
  Body,
  Get,
  Delete,
  Header,
  Put,
} from '@nestjs/common';

import { InventoryService } from '../services/inventory.service';
import { Item } from '../entities/item.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get(':heroId')
  async getInventory(@Param('heroId') heroId: string) {
    return await this.inventoryService.getInventory(heroId);
  }

  @Get(':heroId/:rarity')
  async getByRarity(
    @Param('heroId') heroId: string,
    @Param('rarity') rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ) {
    return await this.inventoryService.getByRarity(heroId, rarity);
  }

  @Post('add/:heroId')
  async addItem(@Param('heroId') heroId: string, @Body('item') item: Item) {
    return await this.inventoryService.addToInventory(heroId, item);
  }

  @Delete('sell/:heroId/:uniqueId')
  async sellItem(
    @Param('heroId') heroId: string,
    @Param('uniqueId') uniqueId: string
  ) {
    return await this.inventoryService.sellFromInventory(heroId, uniqueId);
  }

  @Get('equip/:heroId')
  async getEquip(@Param('heroId') heroId: string) {
    return await this.inventoryService.getEquip(heroId);
  }

  @Post('equip')
  async equipItem(@Body() equipData: { heroId: string; uniqueId: string }) {
    return await this.inventoryService.equipItem(
      equipData.heroId,
      equipData.uniqueId
    );
  }

  @Post('unequip')
  async unequipItem(
    @Body() unequipData: { heroId: string; itemType: 'weapon' | 'armor' }
  ) {
    return await this.inventoryService.unequipItem(
      unequipData.heroId,
      unequipData.itemType
    );
  }
}
