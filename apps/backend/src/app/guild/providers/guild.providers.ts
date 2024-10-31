import { DataSource } from "typeorm";
import { Guild } from "../entities/guild.entity";
import { GuildParticipant } from "../entities/guildParticipant.entity";
import { GuildBoss } from "../entities/guildBoss.entity";

export const guildProviders = [
    {
        provide: 'GUILD_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Guild),
        inject: ['DATA_SOURCE']
    },
    {
        provide: 'GUILD_PARTICIPANT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(GuildParticipant),
        inject: ['DATA_SOURCE']
    },
    {
        provide: 'GUILD_BOSS_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(GuildBoss),
        inject: ['DATA_SOURCE']
    }
];