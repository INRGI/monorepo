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

  /**
   * Finds a single itemBox by id and includes all its items.
   * @param itemBoxId - The id of the itemBox to find.
   * @returns The itemBox and its items.
   */
  private async getOneBox(itemBoxId: DeleteItemBoxDto): Promise<ItemBox> {
    const result = await this.itemBoxRepository
      .createQueryBuilder('ItemBox')
      .leftJoinAndSelect('ItemBox.items', 'item')
      .where('ItemBox.id = :id', { id: itemBoxId })
      .getOne();
    return result;
  }

  /**
   * Generates a random rarity from the given chances object.
   * @param chances The object specifying the chances of each rarity.
   * @returns The generated rarity.
   */
  private getRandomRarity(
    chances: Chances
  ): 'common' | 'rare' | 'epic' | 'legendary' {
    const random = Math.random() * 100;

    if (random < chances.common) return 'common';
    if (random < chances.common + chances.rare) return 'rare';
    if (random < chances.common + chances.rare + chances.epic) return 'epic';
    return 'legendary';
  }

  /**
   * Finds all itemBoxes that contain all 4 types of items.
   * @returns An array of itemBoxes, sorted by name in ascending order.
   */
  private async handleFindAllJob(): Promise<any> {
    const itemboxes = await this.itemBoxRepository
      .createQueryBuilder('itemBox')
      .leftJoin('itemBox.items', 'item')
      .groupBy('itemBox.id')
      .having('COUNT(DISTINCT item.rarity) = 4')
      .getMany();

    return itemboxes;
  }

  /**
   * Finds the 3 most expensive itemBoxes that contain all 4 types of items.
   * @returns An array of 3 itemBoxes, sorted by cost in descending order.
   */
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

/**
 * Creates a new itemBox in the repository with the provided data.
 * @param data.itemBoxData - An object containing the itemBox data to be created.
 * @returns The newly created and saved itemBox.
 * @throws An error if an itemBox with the same name already exists.
 */
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

  /**
   * Updates an itemBox with the given id.
   * @param data.itemBoxData - An object containing the updated itemBox data.
   * @returns The updated itemBox.
   * @throws An error if no itemBox with the given id is found.
   */
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

  /**
   * Deletes an itemBox with the given id.
   * @param data.itemBoxId - An object containing the id of the itemBox to delete.
   * @returns A message indicating that the itemBox was deleted.
   * @throws An error if no itemBox with the given id is found.
   */
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

  /**
   * Given a rarity, select a random item of that rarity, apply enchantments, and return the item.
   * @param data - An object containing the rarity to select by.
   * @returns A randomly selected item of the given rarity.
   * @throws An error if no items of the given rarity are found.
   */
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

  /**
   * Randomly selects an item from the given box based on the rarity chances.
   * @param data.itemBoxId id of the itemBox
   * @returns the randomly selected item
   * @throws Error if no items of the rarity are found
   * @throws Error if the itemBox is not found
   */
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
