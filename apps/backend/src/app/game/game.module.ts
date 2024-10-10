import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { MonstersModule } from '../monster/monster.module';
import { HeroService, UsersModule } from '@org/users';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
import { ItemBoxService } from '../loot/services/itemBox.service';
import { ItemModule } from '../loot/loot.module';

@Module({
  controllers: [BattleController, ShopController],
  providers: [BattleService, ShopService, ItemBoxService],
  imports: [MonstersModule, UsersModule, ItemModule],
})
export class GameModule {}
