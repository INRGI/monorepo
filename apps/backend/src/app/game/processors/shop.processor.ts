import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { HeroService } from '@org/users';
import { Job } from 'bullmq';
import { Types } from 'mongoose';
import { ItemBoxService } from '../../loot/services/itemBox.service';
import { InventoryService } from '../../loot/services/inventory.service';

@Processor('shop')
export class ShopProcessor extends WorkerHost {
/**
 * Initializes a new instance of the ShopProcessor class.
 * 
 * @param {HeroService} heroService - Service to handle operations related to heroes.
 * @param {ItemBoxService} itemBoxService - Service to manage item box operations.
 * @param {InventoryService} inventoryService - Service for handling inventory operations.
 */
  constructor(
    private readonly heroService: HeroService,
    private readonly itemBoxService: ItemBoxService,
    private readonly inventoryService: InventoryService
  ) {
    super();
  }


  /**
   * Handles jobs related to shopping.
   *
   * @param {Job<any, any, string>} job - The job to process.
   * @returns {Promise<any>} The result of the job.
   *
   * @remarks
   * This method is used to handle jobs related to shopping. The jobs are
   * processed according to their name. If the job name is 'buy-case', the
   * method will buy a case and add the items to the hero's inventory. If the
   * job name is 'buy-random-item', the method will buy a random item of a
   * given rarity and add it to the hero's inventory. If the job name is not
   * recognized, the method will throw an exception.
   */
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
