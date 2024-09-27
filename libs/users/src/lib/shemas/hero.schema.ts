import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';

export type HeroDocument = Hero & Document;

@Schema()
export class Hero {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 1 })
  level: number;

  @Prop({ default: 0 })
  experience: number;

  @Prop({ default: 0 })
  coins: number;

  @Prop({ type: String, ref: 'User' })
  user: User;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
