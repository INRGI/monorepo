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

  /**
   * Creates a new user
   * @param createUserDto contains the email and password of the new user
   * @returns The newly created user
   * @throws ConflictException if a user with the same email already exists
   */
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

  /**
   * Finds a user by email
   * @param email the email of the user to find
   * @returns The user with the given email, or null if no such user exists
   */
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });
    
    return user;
  }

  /**
   * Checks if a given password matches a hashed password
   * @param plainPassword the unhashed password to check
   * @param hashedPassword the hashed password to check against
   * @returns true if the passwords match, false otherwise
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
