import { IsNumber, IsString, Min } from 'class-validator';

export class PlaySlotDto {
  @IsNumber()
  @Min(1)
  bet: number;

  @IsString()
  heroId: string;
}
