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

  /**
   * Plays a round of the slot machine.
   *
   * @param bet The amount to bet.
   * @param heroId The ID of the hero to play with.
   * @returns An object with the result of the round and the amount won.
   */
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

  /**
   * Calculates the winnings based on the slot machine result and bet amount.
   *
   * @param result An array of symbols representing the outcome of the slot machine spin.
   * @param bet The amount of coins bet in the slot machine round.
   * @returns The amount won. If all symbols in the result are the same, the bet is multiplied
   *          by the symbol's multiplier. Otherwise, returns 0.
   */
  private calculateWin(result: string[], bet: number): number {
    if (new Set(result).size === 1) {
      const symbol = result[0];

      return bet * (this.multipliers[symbol] || 1);
    }

    return 0;
  }
}
