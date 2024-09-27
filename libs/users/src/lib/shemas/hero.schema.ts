import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type HeroDocument = Hero & Document;

@Schema()
export class Hero {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 'https://img.freepik.com/premium-photo/pixel-art-knight-character-rpg-game-character-retro-style-8-bit-game-ai_985124-1868.jpg' })
  imageUrl: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 10 })
  attack: number;

  @Prop({ default: 100 })
  health: number

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 0 })
  coins: number;

  @Prop({ type: String, ref: 'User' })
  user: User;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
