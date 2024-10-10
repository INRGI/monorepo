export class CreateEnchantDto {
    name: string;
    typeFor: 'weapon' | 'armor';
    enchantment: 'damage' | 'health';
    chances: number; 
  }
  