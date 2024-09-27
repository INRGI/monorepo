import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './shemas/user.schema';
import { Hero, HeroDocument } from './shemas/hero.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, @InjectModel(Hero.name) private heroModel: Model<HeroDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hero = new this.heroModel({
      name: email,
    });

    const createdHero = await hero.save();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      hero: createdHero._id, 
    });

    return await newUser.save();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    
    return user;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
