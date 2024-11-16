import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Potion } from './potion.entity';

@Entity()
export class HeroPotion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heroId: string;

  @ManyToOne(() => Potion, (potion) => potion.id)
  potion: Potion;

  @CreateDateColumn({ nullable: true })
  activatedAt: Date;
}
