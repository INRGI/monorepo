import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ItemService } from './services/item.service';
import { lootProviders } from './providers/loot.providers';
import { ItemBoxService } from './services/itemBox.service';
import { ItemController } from './controllers/item.controller';
import { ItemBoxController } from './controllers/itemBox.controller';
import { EnchantService } from './services/enchant.service';
import { EnchantController } from './controllers/enchant.controller';
import { InventoryService } from './services/inventory.service';
import { InventoryController } from './controllers/inventory.controller';
import { UsersModule } from '@org/users';
import { BullModule } from '@nestjs/bullmq';
import { EnchantProcessor } from './processors/enchant.processor';
import { InventoryProcessor } from './processors/inventory.processor';
import { ItemProcessor } from './processors/item.processor';
import { ItemBoxProcessor } from './processors/itemBox.processor';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'enchant',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'inventory',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'item',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'itemBox',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [
    ...lootProviders,
    ItemService,
    ItemBoxService,
    EnchantService,
    InventoryService,
    EnchantProcessor,
    InventoryProcessor,
    ItemProcessor,
    ItemBoxProcessor,
  ],
  controllers: [
    ItemController,
    ItemBoxController,
    EnchantController,
    InventoryController,
  ],
  exports: [
    ...lootProviders,
    ItemService,
    ItemBoxService,
    EnchantService,
    InventoryService,
  ],
})
export class ItemModule {}
