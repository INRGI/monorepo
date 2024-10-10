import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";

@Entity()
export class Enchant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500 })
  name: string;

  @Column()
  typeFor: 'weapon' | 'armor';

  @Column()
  enchantment: 'damage' | 'health';

  @Column('float')
  percentageIncrease: number;

  @Column()
  chances: number;

  @ManyToOne(() => Item, (item) => item.enchants)
  item: Item;
}
