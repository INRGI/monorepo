import { Module } from '@nestjs/common';
import { BattleController } from './controllers/battle.controller';
import { BattleService } from './services/battle.service';
import { MonstersModule } from '../monster/monster.module';
import { HeroService, UsersModule } from '@org/users';
import { ShopController } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';
import { ItemBoxService } from '../loot/services/itemBox.service';
import { ItemModule } from '../loot/loot.module';
import { BullModule } from '@nestjs/bullmq';
import { BattleProcessor } from './processors/battle.processor';
import { ShopProcessor } from './processors/shop.processor';
import { DiceGameController } from './controllers/diceGame.controller';
import { DiceGameProcessor } from './processors/diceGame.processor';
import { DiceGameService } from './services/diceGame.service';

@Module({
  controllers: [BattleController, ShopController, DiceGameController],
  providers: [BattleService, ShopService, ItemBoxService, DiceGameService, BattleProcessor, ShopProcessor, DiceGameProcessor],
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
      name: 'battle',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'shop',
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
    BullModule.registerQueue({
      name: 'dice',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class GameModule {}
