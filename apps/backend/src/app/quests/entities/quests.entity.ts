import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HeroQuest } from './heroQuest.entity';

@Entity()
export class Quests {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  taskType: string;

  @Column()
  targetAmount: number;

  @Column()
  rewardCoins: number;

  @OneToMany(() => HeroQuest, (heroQuest) => heroQuest.quest, {cascade: true})
  heroes: HeroQuest[];
}
