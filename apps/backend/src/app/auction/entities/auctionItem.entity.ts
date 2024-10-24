import { IsInt, IsString, Min } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AuctionItem {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ['common' , 'rare' , 'epic' , 'legendary'], default: 'common' })
  rarity: 'common' | 'rare' | 'epic' | 'legendary';

  @IsString()
  @Column()
  uniqueItemId: string;

  @IsString()
  @Column()
  sellerId: string;

  @Min(1)
  @IsInt()
  @Column()
  price: number;

  @Column({ type: 'enum', enum: ['open', 'sold', 'cancelled'], default: 'open' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
