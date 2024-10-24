import { Item } from "../../loot/entities/item.entity";

export class BuyItemDto{
    id: number;
    newOwnerHeroId: string;
    oldOwnerHeroId: string;
    uniqueId: string;
    price: number;
}