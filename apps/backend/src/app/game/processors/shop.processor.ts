import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { HeroService } from '@org/users';
import { Job } from 'bullmq';
import { Types } from 'mongoose';
import { ItemBoxService } from '../../loot/services/itemBox.service';
import { InventoryService } from '../../loot/services/inventory.service';

@Processor('shop')
export class ShopProcessor extends WorkerHost {
  constructor(
    private readonly heroService: HeroService,
    private readonly itemBoxService: ItemBoxService,
    private readonly inventoryService: InventoryService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'buy-case': {
        const { hero, price, itemBoxId } = job.data;
        if (!hero._id) {
          throw new HttpException('Hero not Found', 303);
        }

        const heroId: Types.ObjectId = hero._id as Types.ObjectId;

        const result = await this.heroService.spendCoins(heroId, price);

        if (!result) {
          throw new HttpException('Something went wrong', 303);
        }

        const item = await this.itemBoxService.randomItemInABox(itemBoxId);
        const inventory = await this.inventoryService.addToInventory(
          `${heroId}`,
          item
        );
        return item;
      }
      case 'buy-random-item': {
        const { hero, price, rarity } = job.data;
        if (!hero._id) {
          throw new HttpException('Hero not Found', 303);
        }

        const heroId: Types.ObjectId = hero._id as Types.ObjectId;

        const result = await this.heroService.spendCoins(heroId, price);

        if (!result) {
          throw new HttpException('Something went wrong', 303);
        }

        const item = await this.itemBoxService.randomItemByRarity(rarity);
        const inventory = await this.inventoryService.addToInventory(
          `${heroId}`,
          item
        );

        return { item, inventory };
      }
    }
  }
}
