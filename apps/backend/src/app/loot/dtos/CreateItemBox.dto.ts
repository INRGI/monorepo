export class CreateItemBoxDto {
  id: number;
  name: string;
  cost: number;
  image: string;
  chances: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
  };

  items: [];
}
