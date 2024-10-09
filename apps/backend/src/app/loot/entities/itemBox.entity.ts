import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn } from 'typeorm';
import { Item } from './item.entity';

export class Chances {
  @Column({ default: 80 })
  common: number;

  @Column({ default: 14 })
  rare: number;

  @Column({ default: 5 })
  epic: number;

  @Column({ default: 1 })
  legendary: number;
}

@Entity()
export class ItemBox {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  image: string;

  @Column()
  cost: number;

  @Column(() => Chances)
  chances: Chances;

  @OneToMany(() => Item, (item) => item.itemBox, {cascade: true})
  @JoinColumn()
  items: Item[];
}