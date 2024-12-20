import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { MonstersService } from '../../monster/monster.service';
import { HeroInterface, HeroService } from '@org/users';
import { NotFoundException } from '@nestjs/common';
import { PotionService } from '../../potion/potion.service';

@Processor('battle')
export class BattleProcessor extends WorkerHost {
  constructor(
    private readonly monstersService: MonstersService,
    private readonly potionService: PotionService,
    private readonly heroService: HeroService,
    @InjectQueue('quests') private readonly questsQueue: Queue,
    @InjectQueue('skills') private readonly skillsQueue: Queue
  ) {
    super();
  }
  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'get-monsters': {
        return await this.monstersService.getRandomMonsters(6);
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
    if (character.hp <= 0) return { monster, character };
    monster.health -= character.attack;

    const chance = Math.random();
    if (chance <= 0.1) {
      await this.heroService.minusHP(character._id, monster.attack);
    }

    if (monster.health <= 0) {
      monster.health = 0;

      const potions = await this.potionService.getHeroesPotions(
        character._id as unknown as string
      );
      const doubleXPPotion = potions.find((heroPotion) => {
        const activatedDate = new Date(heroPotion.activatedAt);
        const now = new Date();
        const isActive =
          now.getTime() - activatedDate.getTime() <=
          heroPotion.potion.duration * 60 * 1000;
          return heroPotion.potion.effect === 'double_xp' && isActive;
      });
      if (doubleXPPotion) {
        await this.heroService.addXp(character._id, monster.xp * 2);
      } else {
        await this.heroService.addXp(character._id, monster.xp);
      }

      await this.heroService.earnCoins(character._id, monster.xp);
      await this.questsQueue.add('complete-quest', {
        heroId: character._id,
        type: 'Battle',
      });
    }
    await this.skillsQueue.add('reduce-cooldown', { heroId: character._id });
    const hero = await this.heroService.findByUserId(character._id);

    return { monster, hero };
  }
}
