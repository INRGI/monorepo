import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemBox } from '../entities/itemBox.entity';
import { Inject } from '@nestjs/common';
import { CreateItemDto } from '../dtos/CreateItem.dto';
import { UpdateItemDto } from '../dtos/UpdateItem.dto';
import { DeleteItemDto } from '../dtos/DeleteItem.dto';

@Processor('item')
export class ItemProcessor extends WorkerHost {
  constructor(
    @Inject('ITEM_REPOSITORY')
    private itemRepository: Repository<Item>,
    @Inject('ITEM_BOX_REPOSITORY')
    private itemBoxRepository: Repository<ItemBox>
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'find-all': {
        return await this.handleFindAllJob();
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
    }
  }

  private async handleFindAllJob(): Promise<any> {
    const itemboxes = await this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.itemBox', 'itemBox')
      .getMany();

    return itemboxes;
  }

  private async handleCreateJob(data: {
    itemData: CreateItemDto;
  }): Promise<any> {
    const { itemData } = data;
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

  private async handleUpdateJob(data: {
    itemData: UpdateItemDto;
  }): Promise<any> {
    const { itemData } = data;
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

  private async handleDeleteJob(data: {
    itemBoxId: DeleteItemDto;
  }): Promise<any> {
    const { itemBoxId } = data;
    await this.itemRepository
      .createQueryBuilder()
      .delete()
      .from(Item)
      .where('id = :id', { id: itemBoxId.id })
      .execute();

    return 'Deleted!';
  }
}
