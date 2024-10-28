import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Equip } from './equip.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  inventory: Item[];

  @Column()
  heroId: string;

  @OneToOne(() => Equip, equip => equip.inventory)
  @JoinColumn()
  equip: Equip;
}
