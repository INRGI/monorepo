import { IsInt, IsString } from 'class-validator';

export class CreatePotionDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  effect: string;

  @IsInt()
  duration: number;

  @IsInt()
  multiplier: number;
}
