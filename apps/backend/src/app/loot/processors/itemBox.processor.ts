import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Chances, ItemBox } from '../entities/itemBox.entity';
import { Item } from '../entities/item.entity';
import { EnchantService } from '../services/enchant.service';
import { v4 as uuidv4 } from 'uuid';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';
import { UpdateItemBoxDto } from '../dtos/UpdateItemBox.dto';

@Processor('itemBox')
export class ItemBoxProcessor extends WorkerHost {
  constructor(
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>,
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
    private enchantService: EnchantService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'find-all': {
        return await this.handleFindAllJob();
      }
      case 'find-the-most-expensive': {
        return await this.handleFindTheMostExpJob();
      }
      case 'create': {
        return await this.handleCreateJob(job.data);
      }
      case 'update': {
        return await this.handleUpdateJob(job.data);
      }
      case 'delete': {
        return await this.handleDeleteJob(job.data);
      }
      case 'random-item-by-rarity': {
        return await this.handleRandomItemByRarity(job.data);
      }
      case 'random-item-in-box': {
        return await this.handleRandomItemInABoxJob(job.data);
      }
    }
  }

  private async getOneBox(itemBoxId: DeleteItemBoxDto): Promise<ItemBox> {
    const result = await this.itemBoxRepository
      .createQueryBuilder('ItemBox')
      .leftJoinAndSelect('ItemBox.items', 'item')
      .where('ItemBox.id = :id', { id: itemBoxId })
      .getOne();
    return result;
  }

  private getRandomRarity(
    chances: Chances
  ): 'common' | 'rare' | 'epic' | 'legendary' {
    const random = Math.random() * 100;

    if (random < chances.common) return 'common';
    if (random < chances.common + chances.rare) return 'rare';
    if (random < chances.common + chances.rare + chances.epic) return 'epic';
    return 'legendary';
  }

  private async handleFindAllJob(): Promise<any> {
    const itemboxes = await this.itemBoxRepository
      .createQueryBuilder('itemBox')
      .leftJoin('itemBox.items', 'item')
      .groupBy('itemBox.id')
      .having('COUNT(DISTINCT item.rarity) = 4')
      .getMany();

    return itemboxes;
  }

  private async handleFindTheMostExpJob(): Promise<any> {
    const itemboxes = await this.itemBoxRepository
      .createQueryBuilder('itemBox')
      .leftJoin('itemBox.items', 'item')
      .groupBy('itemBox.id')
      .having('COUNT(DISTINCT item.rarity) = 4')
      .orderBy('itemBox.cost', 'DESC')
      .limit(3)
      .getMany();
    return itemboxes;
  }

  private async handleCreateJob(data: {
    itemBoxData: CreateItemBoxDto;
  }): Promise<any> {
    const { itemBoxData } = data;
    const itemBox = await this.itemBoxRepository.findOne({
      where: { name: itemBoxData.name },
    });

    if (itemBox) {
      throw new Error(`ItemBox with this name already exists`);
    }
    const result = await this.itemBoxRepository.create(itemBoxData);
    return await this.itemBoxRepository.save(result);
  }

  private async handleUpdateJob(data: {
    itemBoxData: UpdateItemBoxDto;
  }): Promise<any> {
    const { itemBoxData } = data;
    await this.itemBoxRepository
      .createQueryBuilder()
      .update(ItemBox)
      .set(itemBoxData)
      .where('id = :id', { id: itemBoxData.id })
      .execute();

    const itemBox = await this.itemBoxRepository.findOne({
      where: { id: itemBoxData.id },
    });

    return itemBox;
  }

  private async handleDeleteJob(data: {
    itemBoxId: DeleteItemBoxDto;
  }): Promise<any> {
    const { itemBoxId } = data;
    await this.itemBoxRepository
      .createQueryBuilder()
      .delete()
      .from(ItemBox)
      .where('id = :id', { id: itemBoxId.id })
      .execute();

    return 'Deleted!';
  }

  private async handleRandomItemByRarity(data: {
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  }): Promise<any> {
    const { rarity } = data;
    const itemsByRarity = await this.itemRepository
      .createQueryBuilder('item')
      .where('item.rarity = :rarity', { rarity })
      .getMany();

    if (itemsByRarity.length === 0) {
      throw new Error(`No items found for rarity: ${rarity}`);
    }

    const randomIndex = Math.floor(Math.random() * itemsByRarity.length);

    let selectedItem = itemsByRarity[randomIndex];

    selectedItem = await this.enchantService.applyEnchantment(selectedItem);
    selectedItem.uniqueId = uuidv4();

    return selectedItem;
  }

  private async handleRandomItemInABoxJob(data: {
    itemBoxId: DeleteItemBoxDto;
  }): Promise<any> {
    const { itemBoxId } = data;
    const box = await this.getOneBox(itemBoxId);
    if (!box || !box.items.length) {
      throw new Error('ItemBox not found');
    }

    const rarity = this.getRandomRarity(box.chances);

    const itemsByRarity = await this.itemRepository
      .createQueryBuilder('item')
      .where('item.itemBoxId = :id', { id: itemBoxId })
      .andWhere('item.rarity = :rarity', { rarity })
      .getMany();

    if (!itemsByRarity.length) {
      throw new Error(`No items of this rarity found`);
    }

    const randomIndex = Math.floor(Math.random() * itemsByRarity.length);
    let selectedItem = itemsByRarity[randomIndex];

    selectedItem = await this.enchantService.applyEnchantment(selectedItem);
    selectedItem.uniqueId = uuidv4();

    return selectedItem;
  }
}
