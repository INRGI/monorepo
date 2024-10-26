import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Quests } from './quests.entity';

@Entity()
export class HeroQuest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  heroId: string;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => Quests, { eager: true })
  quest: Quests;
}
