import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { NotFoundException } from '@nestjs/common';
import { HeroInterface, HeroService } from '@org/users';
import { Job, Queue } from 'bullmq';

@Processor('dice')
export class DiceGameProcessor extends WorkerHost {
  constructor(private readonly heroService: HeroService, @InjectQueue('quests') private readonly questsQueue: Queue) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'play': {
        return await this.handlePlayJob(job.data);
      }
      default:
        throw new NotFoundException('Job name not recognized');
    }
  }

  private async handlePlayJob(data: { character: HeroInterface; betAmount: number }): Promise<any>{
    const { character, betAmount } = data;

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
        await this.questsQueue.add('complete-quest', {heroId: character._id, type: 'Dices'});

        return { hero, heroRoll, botRoll, winnings };
  }
}
