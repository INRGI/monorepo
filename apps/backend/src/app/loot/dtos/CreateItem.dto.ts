export class CreateItemDto {
    name: string;
    type: 'weapon' | 'armor';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    itemBox: string;
  }