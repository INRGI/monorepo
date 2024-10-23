import { DataSource } from "typeorm";
import { AuctionItem } from "../entities/auctionItem.entity";

export const auctionProviders = [
    {
        provide: 'AUCTION_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AuctionItem),
        inject: ['DATA_SOURCE']
    }
];