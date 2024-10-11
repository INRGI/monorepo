import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  inventory: Item[];

  @Column()
  heroId: string;
}
