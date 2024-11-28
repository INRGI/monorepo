import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class HeroSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    heroId: string;

    @Column("json")
    models: ['woman', 'man', 'fun'];

    @Column({default: 'woman'})
    hero3DModel: 'woman' | 'man' | 'fun';
}
