import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Guild } from './guild.entity';

@Entity()
export class GuildBoss {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @Column()
  rewardCoins: number;

  @Column()
  attack: number;

  @Column()
  health: number;

  @OneToMany(() => Guild, (guild) => guild.boss)
  guild: Guild[];
}
