import { Injectable } from '@nestjs/common';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';

@Injectable()
export class SlotService {
  private readonly symbols = ['🍒', '🍋', '🍉', '⭐', '🔔'];
  private readonly multipliers = {
    '🍒': 2,
    '🍋': 3,
    '🍉': 5,
    '⭐': 10,
    '🔔': 20,
  };

  constructor(private readonly heroService: HeroService) {}

  async play(
    bet: number,
    heroId: string
  ): Promise<{ result: string[]; win: number }> {
    const result = Array(3)
      .fill(null)
      .map(() => this.symbols[Math.floor(Math.random() * this.symbols.length)]);

    const win = this.calculateWin(result, bet);

    await this.heroService.spendCoins(heroId as unknown as Types.ObjectId, bet);

    if (win > 0) {
      await this.heroService.earnCoins(
        heroId as unknown as Types.ObjectId,
        win
      );
      return { result, win };
    }
    if (win === 0) {
      return { result, win: -bet };
    }
  }

  private calculateWin(result: string[], bet: number): number {
    if (new Set(result).size === 1) {
      const symbol = result[0];

      return bet * (this.multipliers[symbol] || 1);
    }

    return 0;
  }
}
