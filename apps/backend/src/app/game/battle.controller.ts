import { Controller, Get, Post, Body } from '@nestjs/common';
import { BattleService } from './battle.service';
import { Hero } from '@org/users';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('monsters')
  getMonsters() {
    return this.battleService.getMonsters();
  }

  @Post('attack')
  attack(
    @Body() attackData: { character: Hero; monsterId: number }
  ) {
    return this.battleService.attack(attackData.character, attackData.monsterId);
  }
}
