import { DataSource } from "typeorm";
import { Quests } from "../entities/quests.entity";
import { HeroQuest } from "../entities/heroQuest.entity";

export const questsProviders = [
    {
        provide: 'QUESTS_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Quests),
        inject: ['DATA_SOURCE']
    },
    {
        provide: 'HERO_QUEST_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HeroQuest),
        inject: ['DATA_SOURCE']
    }
]