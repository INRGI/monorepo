import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ItemService } from './services/item.service';
import { lootProviders } from './providers/loot.providers';
import { ItemBoxService } from './services/itemBox.service';
import { ItemController } from './controllers/item.controller';
import { ItemBoxController } from './controllers/itemBox.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...lootProviders, ItemService, ItemBoxService],
  controllers: [ItemController, ItemBoxController],
  exports: [],
})
export class ItemModule {}
