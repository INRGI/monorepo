import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Hero } from './shemas/hero.schema';

@Injectable()
export class HeroService {
    constructor(@InjectModel(Hero.name) private heroModel: Model<Hero>) {}

    async findByUserId(userId: Types.ObjectId): Promise<Hero | null> {
        return this.heroModel.findOne({ _id: userId }).exec();
      }
}
