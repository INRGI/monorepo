import { Item } from "../../loot/entities/item.entity";

export class BuyItemDto{
    id: number;
    newOwnerHeroId: string;
    item: Item;
    oldOwnerHeroId: string;
    uniqueId: string;
    price: number;
}