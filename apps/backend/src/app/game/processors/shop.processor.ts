import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { HeroDocument, HeroService } from '@org/users';
import { Job, Queue } from 'bullmq';
import { Types } from 'mongoose';
import { ItemBoxService } from '../../loot/services/itemBox.service';
import { InventoryService } from '../../loot/services/inventory.service';
import { DeleteItemDto } from '../../loot/dtos/DeleteItem.dto';

@Processor('shop')
export class ShopProcessor extends WorkerHost {
  constructor(
    private readonly heroService: HeroService,
    private readonly itemBoxService: ItemBoxService,
    private readonly inventoryService: InventoryService,
    @InjectQueue('quests') private readonly questsQueue: Queue,
    @InjectQueue('skills') private readonly skillsQueue: Queue
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'buy-case': {
        return await this.handleBuyCaseJob(job.data);
      }
      case 'buy-random-item': {
        return await this.handleBuyRandomItemJob(job.data);
      }
      case 'buy-reset-skills': {
        return await this.handleBuyResetSkillsJob(job.data);
      }
    }
  }

  private async handleBuyResetSkillsJob(data: {
    heroId: string;
    price: number;
  }): Promise<any> {
    const { heroId, price } = data;

    const result = await this.heroService.spendCoins(
      heroId as unknown as Types.ObjectId,
      price
    );
    if (!result) {
      throw new HttpException('Something went wrong', 303);
    }
    await this.skillsQueue.add('reset-skills', { heroId });
    return 'Done';
  }

  private async handleBuyCaseJob(data: {
    hero: HeroDocument;
    price: number;
    itemBoxId: DeleteItemDto;
  }): Promise<any> {
    const { hero, price, itemBoxId } = data;
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
    await this.questsQueue.add('complete-quest', {
      heroId: hero._id,
      type: 'Shop',
    });
    return item;
  }

  private async handleBuyRandomItemJob(data: {
    hero: HeroDocument;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }) {
    const { hero, price, rarity } = data;
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
    await this.questsQueue.add('complete-quest', {
      heroId: hero._id,
      type: 'Shop',
    });

    return { item, inventory };
  }
}
