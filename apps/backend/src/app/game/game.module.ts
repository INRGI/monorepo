import { Module } from '@nestjs/common';
import { BattleController } from './battle.controller';
import { BattleService } from './battle.service';
import { MonstersModule } from '../monster/monster.module';
import { UsersModule } from '@org/users';

@Module({
  controllers: [BattleController],
  providers: [BattleService],
  imports: [MonstersModule, UsersModule],
})
export class GameModule {}
