import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MonstersService } from '../../monster/monster.service';
import { HeroInterface, HeroService } from '@org/users';
import { NotFoundException } from '@nestjs/common';

@Processor('battle')
export class BattleProcessor extends WorkerHost {
  /**
   * @constructor
   * @param {MonstersService} monstersService - service to handle operations with monsters
   * @param {HeroService} heroService - service to handle operations with heroes
   */
  constructor(
    private readonly monstersService: MonstersService,
    private readonly heroService: HeroService
  ) {
    super();
  }
  /**
   * Processes a job. Depending on the job name, it either returns all monsters, or
   * simulates a battle between a hero and a monster.
   * @param {Job<any, any, string>} job - the job to be processed
   * @returns {Promise<any>} - the result of the job processing
   */
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'get-monsters': {
        return await this.monstersService.getMonsters();
      }
      case 'attack': {
        return await this.handleAttackJob(job.data);
      }
      default:
        throw new NotFoundException('Job name not recognized');
    }
  }

  private async handleAttackJob(data: {
    character: HeroInterface;
    monsterId: number;
  }): Promise<any> {
    const { character, monsterId } = data;
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
}
