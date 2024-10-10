import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { HeroInterface, HeroService } from '@org/users';
import { ItemBoxService } from '../loot/services/itemBox.service';
import { DeleteItemBoxDto } from '../loot/dtos/DeleteItemBox.dto';
import { HeroDocument } from 'libs/users/src/lib/shemas/hero.schema';
import { Types } from 'mongoose';

@Injectable()
export class ShopService {
  constructor(
    private readonly heroService: HeroService,
    private readonly itemBoxService: ItemBoxService
  ) {}

  async buyCase(hero: HeroDocument, price: number, itemBoxId: DeleteItemBoxDto) {
    if (!hero._id) {
      throw new HttpException('Hero not Found', 303);
    }
  
    const heroId: Types.ObjectId = hero._id as Types.ObjectId;
    

    const result = await this.heroService.spendCoins(heroId, price);
  
    if (!result) {
      throw new HttpException('Something went wrong', 303);
    }
  
    return await this.itemBoxService.randomItemInABox(itemBoxId);
  }

  async buyRandomItemByRarity(hero: HeroDocument, price: number, rarity: 'common' | 'rare' | 'epic' | 'legendary'){
    if (!hero._id) {
      throw new HttpException('Hero not Found', 303);
    }
  
    const heroId: Types.ObjectId = hero._id as Types.ObjectId;
    

    const result = await this.heroService.spendCoins(heroId, price);
  
    if (!result) {
      throw new HttpException('Something went wrong', 303);
    }

    return await this.itemBoxService.randomItemByRarity(rarity);
  }
  
}
