export class UpdateItemDto {
  id: number;
  name?: string;
  type?: 'weapon' | 'armor';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  image?: string;
  stats?: {
    attack?: number;

    health?: number;
  };
}
