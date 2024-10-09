import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ItemBox } from './itemBox.entity';

export class Stats {
  @Column({ nullable: true })
  attack?: number;

  @Column({ nullable: true })
  health?: number;
}

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  type: 'weapon' | 'armor';

  @Column()
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @Column()
  image: string;

  @Column(() => Stats)
  stats: Stats;

  @ManyToOne(() => ItemBox, (itemBox) => itemBox.items)
  itemBox: ItemBox;
}
