import { DataSource } from "typeorm";
import { Potion } from "../entities/potion.entity";
import { HeroPotion } from "../entities/hero-potion.entity";

export const potionProviders = [
    {
        provide: 'POTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Potion),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'HERO_POTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HeroPotion),
        inject: ['DATA_SOURCE'],
    }
]