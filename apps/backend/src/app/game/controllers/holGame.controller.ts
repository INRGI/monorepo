import { Body, Controller, Post } from '@nestjs/common';
import { HOLGameService } from '../services/holGame.service';
import { HOL, HolResult } from '../processors/holGame.processor';

@Controller('hol-game')
export class HOLGameController {
  constructor(private readonly holGameService: HOLGameService) {}

  @Post('start')
  async startGame(@Body('data') data: HOL): Promise<HOL> {
    return await this.holGameService.startGame(data);
  }

  @Post('stop')
  async stopGame(@Body('data') data: HOL): Promise<HOL | HolResult> {
    return await this.holGameService.stopGame(data);
  }

  @Post('choose')
  async choose(@Body('data') data: HOL): Promise<HOL | HolResult> {
    return await this.holGameService.choose(data);
  }
}
