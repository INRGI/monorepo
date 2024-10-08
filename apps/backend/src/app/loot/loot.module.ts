import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';

import { ItemService } from './services/item.service';
import { lootProviders } from './providers/loot.providers';
import { ItemBoxService } from './services/itemBox.service';

@Module({
  imports: [DatabaseModule],
  providers: [...lootProviders, ItemService, ItemBoxService],
  exports: [ItemService, ItemBoxService],
})
export class ItemModule {}
