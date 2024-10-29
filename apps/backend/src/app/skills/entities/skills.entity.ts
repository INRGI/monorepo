import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { HeroSkill } from './heroSkill.entity';

@Entity()
export class Skills {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  skillType: string;

  @Column()
  damage?: number;
  
  @Column()
  healing?: number;
  
  @Column({ type: 'int', default: 0 })
  cooldown: number;

  @Column({ type: 'int', default: 0 })
  cooldownTurnsLeft: number;

  @OneToMany(() => HeroSkill, (heroSkill) => heroSkill.skill, {cascade: true})
  heroes: HeroSkill[];
}
