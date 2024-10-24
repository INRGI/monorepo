import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hero, HeroDocument } from './shemas/hero.schema';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<HeroDocument>) {}

  async findByUserId(userId: Types.ObjectId): Promise<HeroDocument | null> {
    return await this.heroModel.findOne({ _id: userId }).exec();
  }

  async findAll():Promise<HeroDocument[]>{
    return await this.heroModel.find();
  }

  async earnCoins(heroId: Types.ObjectId, coins: number): Promise<Hero>{
    const hero = await this.findByUserId(heroId);

    if(!hero){
      throw new NotFoundException('Hero not Found');
    }

    hero.coins += coins;
    await hero.save();
    return hero;
  }

  async spendCoins(heroId: Types.ObjectId, coins: number): Promise<Hero>{
    const hero = await this.findByUserId(heroId);

    if(!hero){
      throw new NotFoundException('Hero not Found');
    }

    hero.coins -= coins;

    if(hero.coins < 0){
      throw new HttpException('Not enough coins', 304);
    }

    return await hero.save();
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

    return await hero.save();
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
