import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { MonstersModule } from '../monster/monster.module';
import { HeroService, UsersModule } from '@org/users';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ItemBoxService } from '../loot/services/itemBox.service';
import { ItemModule } from '../loot/loot.module';
import { BullModule } from '@nestjs/bullmq';
import { GameProcessor } from './game.processor';

@Module({
  controllers: [BattleController, ShopController],
  providers: [BattleService, ShopService, ItemBoxService, GameProcessor],
  imports: [
    MonstersModule,
    UsersModule,
    ItemModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'game',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class GameModule {}
