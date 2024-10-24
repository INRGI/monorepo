
export class OpenToSellDto{
    uniqueItemId: string;
    sellerId: string;
    price: number;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}