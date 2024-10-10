import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Chances, ItemBox } from '../entities/itemBox.entity';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';
import { UpdateItemBoxDto } from '../dtos/UpdateItemBox.dto';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';
import { Item } from '../entities/item.entity';
import { EnchantService } from './enchant.service';

@Injectable()
export class ItemBoxService {
  constructor(
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>,
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
    private enchantService: EnchantService,
  ) {}

  async findAll(): Promise<ItemBox[]> {
    const itemboxes = await this.itemBoxRepository
      .createQueryBuilder('itemBox')
      .leftJoinAndSelect('itemBox.items', 'item')
      .groupBy('itemBox.id')
      .having('COUNT(DISTINCT item.rarity) = 4')
      .getMany();

    return itemboxes;
  }

  async findTheMostExpensive(): Promise<ItemBox[]> {
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

  async create(itemBoxData: CreateItemBoxDto): Promise<ItemBox> {
    const itemBox = await this.itemBoxRepository.findOne({
      where: { name: itemBoxData.name },
    });

    if (itemBox) {
      throw new Error(`ItemBox with this name already exists`);
    }
    const result = await this.itemBoxRepository.create(itemBoxData);
    return await this.itemBoxRepository.save(result);
  }

  async update(itemBoxData: UpdateItemBoxDto): Promise<Partial<ItemBox>> {
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

  async delete(itemBoxId: DeleteItemBoxDto) {
    await this.itemBoxRepository
      .createQueryBuilder()
      .delete()
      .from(ItemBox)
      .where('id = :id', { id: itemBoxId.id })
      .execute();

    return 'Deleted!';
  }

  async getOne(itemBoxId: DeleteItemBoxDto): Promise<ItemBox> {
    const result = await this.itemBoxRepository
      .createQueryBuilder('ItemBox')
      .leftJoinAndSelect('ItemBox.items', 'item')
      .where('ItemBox.id = :id', { id: itemBoxId })
      .getOne();
    return result;
  }

  async randomItemInABox(itemBoxId: DeleteItemBoxDto): Promise<Item> {
    const box = await this.getOne(itemBoxId);
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

  return selectedItem;
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
