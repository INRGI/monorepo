export class UpdateEnchantDto {
    name?: string;
    typeFor?: 'weapon' | 'armor';
    enchantment?: 'damage' | 'health';
    chances?: number;
  }
  