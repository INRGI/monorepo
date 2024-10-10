import { Controller, Get, Post, Body } from '@nestjs/common';
import { BattleService } from './battle.service';
import { HeroInterface } from '@org/users';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('monsters')
  getMonsters() {
    return this.battleService.getMonsters();
  }

  @Post('attack')
  attack(
    @Body() attackData: { character: HeroInterface; monsterId: number }
  ) {
    return this.battleService.attack(attackData.character, attackData.monsterId);
  }
}
