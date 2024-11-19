import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hero, HeroDocument } from './shemas/hero.schema';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<HeroDocument>) {}

  /**
   * Find a hero by their associated user id.
   * @param userId The id of the user to find the hero for.
   * @returns The hero document if found, otherwise null.
   */
  async findByUserId(userId: Types.ObjectId): Promise<HeroDocument | null> {
    return await this.heroModel.findOne({ _id: userId }).exec();
  }

  /**
   * Finds all heroes in the database.
   * @returns A promise that resolves with an array of HeroDocuments.
   */
  async findAll(): Promise<HeroDocument[]> {
    return await this.heroModel.find();
  }

  /**
   * Increase the coins of the hero with the given id.
   * @param heroId The id of the hero to increase the coins for.
   * @param coins The amount of coins to increase.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async earnCoins(heroId: Types.ObjectId, coins: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);

    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }

    hero.coins += coins;
    await hero.save();
    return hero;
  }

/**
 * Decreases the coins of the hero with the specified id.
 * @param heroId The id of the hero whose coins are to be decreased.
 * @param coins The amount of coins to decrease.
 * @returns A promise that resolves with the hero document after the update.
 * @throws {NotFoundException} If the hero with the given id is not found.
 * @throws {HttpException} If the hero does not have enough coins.
 */
  async spendCoins(heroId: Types.ObjectId, coins: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }
    hero.coins -= coins;
    if (hero.coins < 0) {
      throw new HttpException('Not enough coins', 304);
    }
    return await hero.save();
  }


  /**
   * Adds the given amount of experience points to the hero with the given id.
   * @param heroId The id of the hero to add experience points to.
   * @param xp The amount of experience points to add.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async addXp(heroId: Types.ObjectId, xp: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);

    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }

    hero.experience += xp;

    if (hero.experience >= this.getExpToLevelUp(hero.level)) {
      this.levelUp(hero);
      hero.hp = hero.health;
    }

    return await hero.save();
  }

  /**
   * Increases the health of the hero with the given id.
   * @param heroId The id of the hero to increase the health of.
   * @param health The amount of health to increase.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async addHealth(heroId: Types.ObjectId, health: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }
    hero.health += health;
    hero.hp += health;

    return await hero.save();
  }

/**
 * Increases the attack power of the hero with the given id.
 * @param heroId The id of the hero whose attack power is to be increased.
 * @param attack The amount of attack power to add.
 * @returns A promise that resolves with the hero document after the update.
 * @throws {NotFoundException} If the hero with the given id is not found.
 */
  async addAttack(heroId: Types.ObjectId, attack: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);

    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }
    hero.attack += attack;

    return await hero.save();
  }

  /**
   * Decreases the health of the hero with the given id.
   * @param heroId The id of the hero whose health is to be decreased.
   * @param health The amount of health to decrease.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async minusHealth(heroId: Types.ObjectId, health: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }

    hero.health -= health;
    hero.hp -= health;
    return await hero.save();
  }

  /**
   * Decreases the attack power of the hero with the given id.
   * @param heroId The id of the hero whose attack power is to be decreased.
   * @param attack The amount of attack power to subtract.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async minusAttack(heroId: Types.ObjectId, attack: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }

    hero.attack -= attack;

    return await hero.save();
  }

  /**
   * Increases the health points of the hero with the given id.
   * @param heroId The id of the hero whose health points are to be increased.
   * @param hp The amount of health points to add.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async addHP(heroId: Types.ObjectId, hp: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);

    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }
    hero.hp += hp;
    if (hero.hp > hero.health) hero.hp = hero.health;
    return await hero.save();
  }

  /**
   * Decreases the health points of the hero with the given id.
   * @param heroId The id of the hero whose health points are to be decreased.
   * @param hp The amount of health points to subtract.
   * @returns A promise that resolves with the hero document after the update.
   * @throws {NotFoundException} If the hero with the given id is not found.
   */
  async minusHP(heroId: Types.ObjectId, hp: number): Promise<Hero> {
    const hero = await this.findByUserId(heroId);
    if (!hero) {
      throw new NotFoundException('Hero not Found');
    }
    hero.hp -= hp;
    if (hero.hp <= 0) {
      hero.hp = 0;
    }

    return await hero.save();
  }

  /**
   * Increases the level of the given hero by one, resets the experience,
   * and increases the attack and health.
   * @param hero The hero document to level up.
   */
  private levelUp(hero: HeroDocument) {
    hero.level += 1;
    hero.experience = 0;
    hero.attack += 5;
    hero.health += 10;
  }

  /**
   * Calculates the amount of experience points required to level up.
   * @param level The current level of the hero.
   * @returns The amount of experience points required to level up.
   */
  private getExpToLevelUp(level: number): number {
    return 100 * level;
  }
}
