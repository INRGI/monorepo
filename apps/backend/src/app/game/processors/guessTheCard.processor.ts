import { Processor, WorkerHost } from '@nestjs/bullmq';
import { HeroInterface, HeroService } from '@org/users';
import { Job } from 'bullmq';

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
    character: HeroInterface;
    betAmount: number;
  }) {}

  private async handleChooseCardJob(data){}

  private async generateCards(){}
}
