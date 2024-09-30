import { Injectable, NotFoundException } from "@nestjs/common";
import { Monster, MonstersService } from "../monster/monster.service";
import { Hero, HeroService } from "@org/users";

@Injectable()
export class BattleService {
  constructor(
    private readonly monstersService: MonstersService,
    private readonly heroService: HeroService
  ) {}

  getMonsters(): Monster[] {
    return this.monstersService.getMonsters();
  }

  async attack(character: Hero, monsterId: number): Promise<{ monster: Monster; hero: Hero }> {
    const monster = this.monstersService.getMonsterById(monsterId);
    if (!monster) {
      throw new NotFoundException('Monster not found');
    }

    monster.health -= character.attack;

    if (monster.health <= 0) {
      monster.health = 0;
      await this.heroService.addXp(character._id, monster.xp);
    }

    return { monster, hero: character };
  }
}
