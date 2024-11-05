import { Body, Controller, Post } from '@nestjs/common';
import { GuessCardService } from '../services/guessCard.service';
import { HeroDocument, HeroInterface } from '@org/users';
import { Card } from '../processors/guessTheCard.processor';

@Controller('guess-card')
export class GuessCardController {
  constructor(private readonly guessCardService: GuessCardService) {}

  @Post('start')
  async startGame(
    @Body('hero') hero: HeroInterface,
    @Body('betAmount') betAmount: number
  ): Promise<{ hero: HeroDocument; cards: Card[] }> {
    return await this.guessCardService.startGame(hero, betAmount);
  }

  @Post('choose')
  async chooseCard(
    @Body('hero') hero: HeroInterface,
    @Body('cards') cards: Card[],
    @Body('cardId') cardId: number
  ): Promise<{ hero: HeroDocument; card: Card }> {
    return await this.guessCardService.chooseCard(hero, cardId, cards);
  }
}
