import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ItemBox } from './itemBox.entity';
import { Enchant } from './enchant.entity';

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

  @Column()
  uniqueId: string;

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

  @Column({ nullable: true })
  enchanted: string;

  @ManyToOne(() => ItemBox, (itemBox) => itemBox.items)
  itemBox: ItemBox;

  @OneToMany(() => Enchant, (enchant) => enchant.item, { cascade: true })
  @JoinColumn()
  enchants: Enchant[];
}
