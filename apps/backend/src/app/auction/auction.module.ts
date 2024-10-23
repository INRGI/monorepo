import { Module } from '@nestjs/common';
import { auctionProviders } from './providers/auction.providers';
import { AuctionProcessor } from './processors/auction.processor';
import { DatabaseModule } from '../database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { AuctionController } from './controllers/auction.controller';
import { AuctionService } from './services/auction.service';
import { ItemModule } from '../loot/loot.module';
import { InventoryService } from '../loot/services/inventory.service';
import { ItemService } from '../loot/services/item.service';
import { HeroService, UsersModule } from '@org/users';

@Module({
  providers: [
    ...auctionProviders,
    AuctionProcessor,
    AuctionService,
  ],
  controllers: [AuctionController],
  imports: [
    DatabaseModule,
    ItemModule,
    UsersModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'auction',
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
  ],
  exports: [...auctionProviders],
})
export class AuctionModule {}
