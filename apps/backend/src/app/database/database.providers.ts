import { DataSource } from 'typeorm';
import { Item } from '../loot/entities/item.entity';
import { ItemBox } from '../loot/entities/itemBox.entity';
import { Enchant } from '../loot/entities/enchant.entity';
import { Inventory } from '../loot/entities/inventory.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
        const dataSource = new DataSource({
            type: 'mysql',
            host: '127.0.0.1',
            port: 8889,
            username: 'root',
            password: 'root',
            database: 'loot',
            entities: [Item, ItemBox, Enchant, Inventory],
            synchronize: true,
          });
          

      return dataSource.initialize();
    },
  },
];