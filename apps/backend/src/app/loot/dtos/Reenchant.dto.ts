import { Item } from "../entities/item.entity";

export class ReenchantDto {
    item: Item;
    heroId: string;
    price: number;
}