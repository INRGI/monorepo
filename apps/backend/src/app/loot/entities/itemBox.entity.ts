import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';

export class Chances {
  @Column({ default: 0 })
  common: number;

  @Column({ default: 0 })
  rare: number;

  @Column({ default: 0 })
  epic: number;

  @Column({ default: 0 })
  legendary: number;
}

@Entity()
export class ItemBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  cost: number;

  @Column(() => Chances)
  chances: Chances;

  @OneToMany(() => Item, (item) => item.itemBox)
  items: Item[];
}