import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Potion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  effect: string;

  @Column()
  duration: number;

  @Column()
  multiplier: number;
}
