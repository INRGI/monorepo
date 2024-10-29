import { DataSource } from "typeorm";
import { Skills } from "../entities/skills.entity";
import { HeroSkill } from "../entities/heroSkill.entity";

export const skillsProviders = [
    {
        provide: 'SKILLS_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Skills),
        inject: ['DATA_SOURCE']
    },
    {
        provide: 'HERO_SKILL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HeroSkill),
        inject: ['DATA_SOURCE']
    },
]