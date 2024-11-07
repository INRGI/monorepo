import { DataSource } from "typeorm";
import { PvpRoom } from "../entities/PvpRoom.entity";

export const pvpProviders = [
    {
        provide: 'PVP_ROOM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PvpRoom),
        inject: ['DATA_SOURCE']
    },
]