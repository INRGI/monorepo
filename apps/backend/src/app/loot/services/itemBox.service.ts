import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemBox } from '../entities/itemBox.entity';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';
import { UpdateItemBoxDto } from '../dtos/UpdateItemBox.dto';
import { DeleteItemBoxDto } from '../dtos/DeleteItemBox.dto';

@Injectable()
export class ItemBoxService {
  constructor(
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>
  ) {}

  async findAll(): Promise<ItemBox[]> {
    const itemboxes = await this.itemBoxRepository
      .createQueryBuilder('itemBox')
      .leftJoinAndSelect('itemBox.items', 'item')
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
    .where("id = :id", {id: itemBoxId.id})
    .execute()

    return "Deleted!"
  }
}
