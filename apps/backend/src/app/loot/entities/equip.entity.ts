import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from './item.entity';
import { Inventory } from './inventory.entity';

@Entity()
export class Equip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json', { nullable: true })
  weapon: Item;

  @Column('json', { nullable: true })
  armor: Item;

  @OneToOne(() => Inventory, inventory => inventory.equip)
  inventory: Inventory;
}
