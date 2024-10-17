import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { HeroInterface, HeroService } from '@org/users';
import { ItemBoxService } from '../../loot/services/itemBox.service';
import { DeleteItemBoxDto } from '../../loot/dtos/DeleteItemBox.dto';
import { HeroDocument } from 'libs/users/src/lib/shemas/hero.schema';
import { Types } from 'mongoose';
import { InventoryService } from '../../loot/services/inventory.service';

@Injectable()
export class ShopService {
  constructor(
    private readonly heroService: HeroService,
    private readonly itemBoxService: ItemBoxService,
    private readonly inventoryService: InventoryService,
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
    
    const item = await this.itemBoxService.randomItemInABox(itemBoxId);
    const inventory = await this.inventoryService.addToInventory(`${heroId}`, item)
    return item;
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

    const item = await this.itemBoxService.randomItemByRarity(rarity);
    const inventory = await this.inventoryService.addToInventory(`${heroId}`, item)

    return {item, inventory}
  }
  
}
