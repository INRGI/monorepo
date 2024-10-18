import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Chances, ItemBox } from '../entities/itemBox.entity';
import { Item } from '../entities/item.entity';
import { EnchantService } from '../services/enchant.service';
import { v4 as uuidv4 } from 'uuid';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';

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
        const itemboxes = await this.itemBoxRepository
          .createQueryBuilder('itemBox')
          .leftJoin('itemBox.items', 'item')
          .groupBy('itemBox.id')
          .having('COUNT(DISTINCT item.rarity) = 4')
          .getMany();

        return itemboxes;
      }
      case 'find-the-most-expensive': {
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
      case 'create': {
        const { itemBoxData } = job.data;
        const itemBox = await this.itemBoxRepository.findOne({
          where: { name: itemBoxData.name },
        });

        if (itemBox) {
          throw new Error(`ItemBox with this name already exists`);
        }
        const result = await this.itemBoxRepository.create(itemBoxData);
        return await this.itemBoxRepository.save(result);
      }
      case 'update': {
        const { itemBoxData } = job.data;
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
      case 'delete': {
        const { itemBoxId } = job.data;
        await this.itemBoxRepository
          .createQueryBuilder()
          .delete()
          .from(ItemBox)
          .where('id = :id', { id: itemBoxId.id })
          .execute();

        return 'Deleted!';
      }
      case 'random-item-by-rarity': {
        const { rarity } = job.data;
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
      case 'random-item-in-box': {
        const { itemBoxId } = job.data;
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
}
