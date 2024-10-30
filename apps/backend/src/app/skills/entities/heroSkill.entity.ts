import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Skills } from "./skills.entity";

@Entity()
export class HeroSkill{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heroId: string;

    @Column()
    level: number;

    @Column({ default: 0 })
    cooldownTurnsLeft?: number;

    @ManyToOne(() => Skills, { eager: true })
    skill: Skills;
}