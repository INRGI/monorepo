import { Injectable } from '@nestjs/common';

export type Monster = {
  id: number;
  name: string;
  health: number;
  attack: number;
  imageUrl: string;
  xp: number;
}

@Injectable()
export class MonstersService {
  private monsters: Monster[] = [
    { id: 1, name: 'Goblin', health: 50, attack: 10, imageUrl: 'https://pics.craiyon.com/2023-11-13/oxloxNSzQDWXIc7Hw3cqhA.webp', xp: 50 },
    { id: 2, name: 'Troll', health: 100, attack: 10, imageUrl: 'https://assetstorev1-prd-cdn.unity3d.com/key-image/8043fd7f-affb-4e66-bf3e-b849ca177f64.jpg', xp: 100 },
    { id: 3, name: 'Berserk', health: 200, attack: 10, imageUrl: 'https://preview.redd.it/8o30c9xydfs91.png?width=640&crop=smart&auto=webp&s=89de33d0580ef8b64ee22d2694c764806da4bab7', xp: 200 },
    { id: 4, name: 'Demon', health: 300, attack: 10, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1jFog7CNRu7tgyNuq3IdkHPQhr2a3qIBUSg&s', xp: 300 },
    { id: 5, name: 'Vampire', health: 400, attack: 10, imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvT8Uj180_3aU4qqAyEq4T4S8ylSgJhn7BoA&s', xp: 400 },
    { id: 6, name: 'Dragon', health: 500, attack: 10, imageUrl: 'https://img.freepik.com/premium-vector/pixel-art-character-enemy-acient-dragon-rpg-8bit_865365-23.jpg', xp: 500 },
  ];

  /**
   * Returns the list of all monsters
   * @returns {Monster[]} The list of all monsters
   */
  getMonsters(): Monster[] {
    return this.monsters;
  }

  /**
   * Finds a monster by id
   * @param id The id of the monster
   * @returns The monster with the given id if found, undefined otherwise
   */
  getMonsterById(id: number): Monster {
    return this.monsters.find(monster => monster.id === id);
  }

  /**
   * Generates a list of monsters with randomized health, attack, and xp
   * @param monsters The number of monsters to generate
   * @returns A list of monsters with randomized values
   */
  async getRandomMonsters(monsters: number): Promise<Monster[]>{
    const randomMonsters: Monster[] = [];
    const uniqueIds = new Set<number>();

    while (randomMonsters.length < monsters) {
      const randomIndex = Math.floor(Math.random() * this.monsters.length);
      const monster = this.monsters[randomIndex];

      if (!uniqueIds.has(monster.id)) {
        uniqueIds.add(monster.id);

        const modifiedMonster: Monster = {
          ...monster,
          health: this.getRandomizedValue(monster.health),
          attack: this.getRandomizedValue(monster.attack),
          xp: this.getRandomizedValue(monster.xp),
        };

        randomMonsters.push(modifiedMonster);
      }
    }
    return randomMonsters;
  }

  private getRandomizedValue(baseValue: number): number{
    const variation = baseValue * 0.2;
    return Math.floor(baseValue + (Math.random() * (variation * 2)) -variation);
  }
}
