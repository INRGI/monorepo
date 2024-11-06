import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HttpException } from '@nestjs/common';
import { HeroDocument, HeroInterface, HeroService } from '@org/users';
import { Job } from 'bullmq';

export interface Card {
  id: number;
  rewardCoins: number;
}

@Processor('guess-the-card')
export class GuessTheCardProcessor extends WorkerHost {
  constructor(private readonly heroService: HeroService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'start-game': {
        return await this.handleStartGameJob(job.data);
      }
      case 'choose-card': {
        return await this.handleChooseCardJob(job.data);
      }
    }
  }

  private async handleStartGameJob(data: {
    hero: HeroInterface;
    betAmount: number;
  }): Promise<{ hero: HeroDocument; cards: Card[] }> {
    const { hero, betAmount } = data;

    const res = await this.heroService.spendCoins(hero._id, betAmount);
    if (!res) throw new HttpException('Something went wrong', 303);

    const cards = await this.generateCards(betAmount);
    const character = await this.heroService.findByUserId(hero._id);
    return { hero: character, cards: cards };
  }

  private async handleChooseCardJob(data: {
    hero: HeroInterface;
    cards: Card[];
    cardId: number;
  }): Promise<{ hero: HeroDocument; card: Card }> {
    const { hero, cardId, cards } = data;

    const chosenCard = cards.find((item) => item.id === cardId);

    await this.heroService.earnCoins(hero._id, chosenCard.rewardCoins);
    const char = await this.heroService.findByUserId(hero._id);

    return { hero: char, card: chosenCard };
  }

  private async generateCards(betAmount: number): Promise<Card[]> {
    const cards: Card[] = [
      { id: 1, rewardCoins: Math.floor(betAmount / 10) },
      { id: 2, rewardCoins: Math.floor(betAmount / 5) },
      { id: 3, rewardCoins: Math.floor(betAmount) },
      { id: 4, rewardCoins: Math.floor(betAmount * 5) },
      { id: 5, rewardCoins: Math.floor(betAmount * 10) },
    ];
  
    // Fisher-Yates
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  
    return cards;
  }
}
