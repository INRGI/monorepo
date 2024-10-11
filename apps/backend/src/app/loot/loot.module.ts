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

@Module({
  imports: [DatabaseModule],
  providers: [...lootProviders, ItemService, ItemBoxService, EnchantService, InventoryService],
  controllers: [ItemController, ItemBoxController, EnchantController, InventoryController],
  exports: [...lootProviders, ItemService, ItemBoxService, EnchantService, InventoryService],
})
export class ItemModule {}
