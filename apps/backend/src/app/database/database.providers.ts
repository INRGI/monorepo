import { DataSource } from 'typeorm';
import { Item } from '../loot/entities/item.entity';
import { ItemBox } from '../loot/entities/itemBox.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
        const dataSource = new DataSource({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '',
            database: 'test',
            entities: [Item, ItemBox],
            synchronize: true,
          });
          

      return dataSource.initialize();
    },
  },
];