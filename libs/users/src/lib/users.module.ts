import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './shemas/user.schema';
import { Hero, HeroSchema } from './shemas/hero.schema';
import { HeroService } from './hero.service';

@Module({
  providers: [UsersService, HeroService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Hero.name, schema: HeroSchema },
    ]),
  ],
  exports: [UsersService, HeroService],
})
export class UsersModule {}
