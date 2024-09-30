import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hero, HeroDocument } from './shemas/hero.schema';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<HeroDocument>) {}

  async findByUserId(userId: Types.ObjectId): Promise<HeroDocument | null> {
    return this.heroModel.findOne({ _id: userId }).exec();
  }

  async addXp (heroId: Types.ObjectId, xp: number): Promise<Hero>{
    const hero = await this.findByUserId(heroId);

    if(!hero){
      throw new NotFoundException('Hero not Found');
    }

    hero.experience += xp;

    if(hero.experience >= this.getExpToLevelUp(hero.level)){
      this.levelUp(hero);
    }

    return hero.save();
  };

  private levelUp(hero: HeroDocument){
    hero.level += 1;
    hero.experience = 0;
    hero.attack += 5;
    hero.health += 10;
  };

  private getExpToLevelUp(level: number): number{
    return 100 * level;
  }
}
