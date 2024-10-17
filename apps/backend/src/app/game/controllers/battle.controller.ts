import { Controller, Get, Post, Body } from '@nestjs/common';
import { BattleService } from '../services/battle.service';
import { HeroInterface } from '@org/users';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('monsters')
  async getMonsters() {
    return await this.battleService.getMonsters();
  }

  @Post('attack')
  async attack(
    @Body() attackData: { character: HeroInterface; monsterId: number }
  ) {
    return await this.battleService.attack(attackData.character, attackData.monsterId);
  }
}
