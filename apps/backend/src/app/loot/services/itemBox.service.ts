import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ItemBox } from '../entities/itemBox.entity';
import { CreateItemBoxDto } from '../dtos/CreateItemBox.dto';

@Injectable()
export class ItemBoxService {
  constructor(
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>
  ) {}

  async findAll(): Promise<ItemBox[]> {
    const itemboxes = this.itemBoxRepository
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
    const result = this.itemBoxRepository.create(itemBoxData);
    return await this.itemBoxRepository.save(result);
  }
}
