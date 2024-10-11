import { DataSource } from 'typeorm';
import { Item } from '../entities/item.entity';
import { ItemBox } from '../entities/itemBox.entity';
import { Enchant } from '../entities/enchant.entity';
import { Inventory } from '../entities/inventory.entity';

export const lootProviders = [
  {
    provide: 'ITEM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Item),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ITEM_BOX_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ItemBox),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'ENCHANT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Enchant),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'INVENTORY_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Inventory),
    inject: ['DATA_SOURCE'],
  },
];


