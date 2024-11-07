
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PvpRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    creatorHeroId: string;

    @Column()
    oponentHeroId?: string;

    @Column()
    heroName: string;

    @Column()
    betAmount: number;
}