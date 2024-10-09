export class UpdateItemDto {
  id: number;
  name?: string;
  type?: 'weapon' | 'armor';
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  stats?: {
    attack?: number;

    health?: number;
  };
}
