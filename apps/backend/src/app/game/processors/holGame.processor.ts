import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { HeroService } from '@org/users';
import { Job } from 'bullmq';
import { Types } from 'mongoose';

export interface HOL {
  guessChoosed?: 'higher' | 'lower';
  prevNumber?: number;
  guessedTimes?: number;
  betAmount: number;
  heroId: string;
}

export interface HolResult {
  rewardCoins: number;
  guessChoosed?: 'higher' | 'lower';
  prevNumber: number;
  ifLoose: boolean;
  heroId: string;
}

@Processor('hol')
export class HOLGameProcessor extends WorkerHost {
  constructor(private readonly heroService: HeroService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'start-game': {
        return await this.handleStartGameJob(job.data);
      }
      case 'stop-game': {
        return await this.handleStopGameJob(job.data);
      }
      case 'choose': {
        return await this.handleChooseJob(job.data);
      }
    }
  }

  private async handleStartGameJob(data: HOL): Promise<HOL> {
    const { betAmount, heroId } = data;

    const res = await this.heroService.spendCoins(
      heroId as unknown as Types.ObjectId,
      betAmount
    );
    if (!res) throw new HttpException('Something went wrong', 303);

    const prevNumber = Math.floor(Math.random() * 100) + 1;

    return { ...data, prevNumber, guessedTimes: 1 };
  }

  private async handleStopGameJob(data: HOL): Promise<HOL | HolResult> {
    const { betAmount, heroId, guessedTimes, prevNumber } = data;

    const reward = guessedTimes > 1 ? guessedTimes * betAmount : betAmount;
    const res = await this.heroService.earnCoins(
      heroId as unknown as Types.ObjectId,
      reward
    );

    return { rewardCoins: reward, prevNumber, heroId, ifLoose: false };
  }

  private async handleChooseJob(data: HOL): Promise<HOL | HolResult> {
    const { betAmount, heroId, guessedTimes, prevNumber, guessChoosed } = data;

    let newNumber = Math.floor(Math.random() * 100) + 1;
    if (newNumber === prevNumber)
      newNumber = Math.floor(Math.random() * 100) + 1;

    if (prevNumber < newNumber && guessChoosed === 'higher') {
      return {
        betAmount,
        heroId,
        guessedTimes: guessedTimes + 1,
        prevNumber: newNumber,
      };
    }

    if (prevNumber > newNumber && guessChoosed === 'lower') {
      return {
        betAmount,
        heroId,
        guessedTimes: guessedTimes + 1,
        prevNumber: newNumber,
      };
    }

    return { rewardCoins: 0, prevNumber: newNumber, heroId, ifLoose: true };
  }
}
