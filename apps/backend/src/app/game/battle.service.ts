import { Injectable } from "@nestjs/common";

@Injectable()
export class BattleService {
  private readonly monsters = [
    { id: 1, name: 'Goblin', health: 50 },
    { id: 2, name: 'Troll', health: 100 },
    { id: 3, name: 'Berserk', health: 200 },
    { id: 4, name: 'Demon', health: 300 },
    { id: 5, name: 'Vampire', health: 400 },
    { id: 6, name: 'Dragon', health: 500 },
  ];

  getMonsters() {
    return this.monsters;
  }

  attack(character: { attack: number }, monster: any) {
    monster.health -= character.attack;
    if (monster.health <= 0) {
      monster.health = 0;
    }
    return { monster };
  }
}
