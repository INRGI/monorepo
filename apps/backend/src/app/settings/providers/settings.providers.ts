import { DataSource } from "typeorm";
import { HeroSetting } from "../entities/heroSetting.entity";

export const settingsProviders = [
    {
        provide: 'HERO_SETTING_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(HeroSetting),
        inject: ['DATA_SOURCE'],
    },
];