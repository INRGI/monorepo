import { Controller, Post, Param, Body } from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { HeroDocument, HeroService } from '@org/users';
import { Types } from 'mongoose';
import { DeleteItemDto } from '../../loot/dtos/DeleteItem.dto';

@Controller('shop')
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly heroService: HeroService
  ) {}

  @Post('buy/:itemBoxId')
  async buyItemBox(
    @Param('itemBoxId') itemBoxId: DeleteItemDto,
    @Body('hero') hero: HeroDocument,
    @Body('price') price: number
  ) {
    return await this.shopService.buyCase(hero, price, itemBoxId);
  }

  @Post('buyByRarity/:rarity')
  async getBoxByRarity(
    @Param('rarity') rarity: 'common' | 'rare' | 'epic' | 'legendary',
    @Body('hero') hero: HeroDocument,
    @Body('price') price: number
  ) {
    return await this.shopService.buyRandomItemByRarity(hero, price, rarity);
  }
}
