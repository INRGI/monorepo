import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemBox } from '../entities/itemBox.entity';
import { Inject } from '@nestjs/common';

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
        const itemboxes = await this.itemRepository
          .createQueryBuilder('item')
          .leftJoinAndSelect('item.itemBox', 'itemBox')
          .getMany();

        return itemboxes;
      }
      case 'create': {
        const { itemData } = job.data;
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
      case 'update': {
        const { itemData } = job.data;
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
      case 'delete': {
        const { itemBoxId } = job.data;
        await this.itemRepository
          .createQueryBuilder()
          .delete()
          .from(Item)
          .where('id = :id', { id: itemBoxId.id })
          .execute();

        return 'Deleted!';
      }
    }
  }
}
