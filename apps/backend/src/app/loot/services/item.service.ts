import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemBox } from '../entities/itemBox.entity';
import { CreateItemDto } from '../dtos/CreateItem.dto';
import { UpdateItemDto } from '../dtos/UpdateItem.dto';
import { DeleteItemDto } from '../dtos/DeleteItem.dto';

@Injectable()
export class ItemService {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>
  ) {}

  async findAll(): Promise<Item[]> {
    const itemboxes = await this.itemRepository
    .createQueryBuilder('item')
    .leftJoinAndSelect('item.itemBox', 'itemBox')
    .getMany();

  return itemboxes;
  }

  async create(itemData: CreateItemDto): Promise<Item> {
    const itemBox = await this.itemBoxRepository.findOne({
      where: { name: itemData.itemBox },
    });

    if (!itemBox) {
      throw new Error(`ItemBox with name ${itemData.itemBox} not found`);
    }

    const newItem = this.itemRepository.create({
      ...itemData,
      itemBox,
    });

    return await this.itemRepository.save(newItem);
  }

  async update(itemData: UpdateItemDto): Promise<Partial<Item>> {
    await this.itemRepository
      .createQueryBuilder()
      .update(Item)
      .set(itemData)
      .where('id = :id', { id: itemData.id })
      .execute();

    const item = await this.itemRepository.findOne({
      where: { id: itemData.id },
    });

    return item;
  }

  async delete(itemBoxId: DeleteItemDto) {
    await this.itemRepository
    .createQueryBuilder()
    .delete()
    .from(Item)
    .where("id = :id", {id: itemBoxId.id})
    .execute()

    return "Deleted!"
  }
}