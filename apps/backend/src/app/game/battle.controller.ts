import { Controller, Get, Post, Body } from '@nestjs/common';
import { BattleService } from './battle.service';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get('monsters')
  getMonsters() {
    return this.battleService.getMonsters();
  }

  @Post('attack')
  attack(@Body() attackData: { character: { attack: number }; monster: any }) {
    return this.battleService.attack(attackData.character, attackData.monster);
  }
}
