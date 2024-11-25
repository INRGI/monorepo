import { Controller, Post, Param, Body } from '@nestjs/common';
import { ShopService } from '../services/shop.service';
import { HeroDocument } from '@org/users';
import { DeleteItemDto } from '../../loot/dtos/DeleteItem.dto';
import { Types } from 'mongoose';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('buy/:itemBoxId')
  async buyItemBox(
    @Param('itemBoxId') itemBoxId: DeleteItemDto,
    @Body('hero') hero: HeroDocument,
    @Body('price') price: number
  ) {
    return await this.shopService.buyCase(hero, price, itemBoxId);
  }

  @Post('buy-reset')
  async buyResetSkill(
    @Body('heroId') heroId: string,
    @Body('price') price: number
  ) {
    return await this.shopService.buyReset(heroId, price);
  }

  @Post('buy-hp')
  async buyHp(
    @Body('heroId') heroId: string,
    @Body('hp') hp: number,
    @Body('price') price: number
  ) {
    return await this.shopService.buyHealth(heroId, price, hp);
  }

  @Post('buyByRarity/:rarity')
  async getBoxByRarity(
    @Param('rarity') rarity: 'common' | 'rare' | 'epic' | 'legendary',
    @Body('hero') hero: HeroDocument,
    @Body('price') price: number
  ) {
    return await this.shopService.buyRandomItemByRarity(hero, price, rarity);
  }

  @Post('buy-potion')
  async buyPotion(
    @Body('heroId') heroId: string,
    @Body('potionId') potionId: number,
    @Body('price') price: number
  ) {
    return await this.shopService.buyPotion(heroId, potionId, price);
  }
}
