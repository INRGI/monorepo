import { Processor, WorkerHost } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { HeroService } from '@org/users';
import { Job } from 'bullmq';

@Processor('dice')
export class DiceGameProcessor extends WorkerHost {
  constructor(private readonly heroService: HeroService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'play': {
        const { character, betAmount } = job.data;

        const heroRoll = Math.floor(Math.random() * 6) + 1;
        const botRoll = Math.floor(Math.random() * 6) + 1;

        let result = '';
        let winnings = 0;

        if (heroRoll > botRoll) {
          result = 'win';
          winnings = betAmount * 2;
          await this.heroService.earnCoins(character._id, betAmount);
        } else if (heroRoll < botRoll) {
          result = 'lose';
          winnings = -betAmount;
          await this.heroService.spendCoins(character._id, betAmount);
        } else {
          result = 'draw';
          winnings = 0;
        }

        const hero = await this.heroService.findByUserId(character._id);

        return { hero, heroRoll, botRoll, winnings };
      }
      default:
        throw new NotFoundException('Job name not recognized');
    }
  }
}
