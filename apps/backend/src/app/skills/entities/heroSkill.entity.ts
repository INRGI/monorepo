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

    @ManyToOne(() => Skills, { eager: true })
    skill: Skills;
}