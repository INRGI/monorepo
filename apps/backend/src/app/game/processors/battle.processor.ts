import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MonstersService } from '../../monster/monster.service';
import { HeroService } from '@org/users';
import { NotFoundException } from '@nestjs/common';

@Processor('battle')
export class BattleProcessor extends WorkerHost {
  constructor(
    private readonly monstersService: MonstersService,
    private readonly heroService: HeroService
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'get-monsters': {
        const monsters = await this.monstersService.getMonsters();
        return monsters;
      }
      case 'attack': {
        const { character, monsterId } = job.data;
        const monster = await this.monstersService.getMonsterById(monsterId);
        if (!monster) {
          throw new NotFoundException('Monster not found');
        }

        monster.health -= character.attack;

        if (monster.health <= 0) {
          monster.health = 0;
          await this.heroService.addXp(character._id, monster.xp);
          await this.heroService.earnCoins(character._id, monster.xp);
        }

        const hero = await this.heroService.findByUserId(character._id);

        return { monster, hero };
      }
      default:
        throw new NotFoundException('Job name not recognized');
    }
  }
}
