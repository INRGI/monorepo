import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shemas/user.schema';
import { Hero, HeroSchema } from './shemas/hero.schema';

@Module({
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hero.name, schema: HeroSchema },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
