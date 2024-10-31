import { IsInt, IsString } from 'class-validator';

export class CreateGuildBossDto {
  @IsString()
  name: string;

  @IsString()
  image: string;

  @IsInt()
  attack: number;

  @IsInt()
  health: number;

  @IsInt()
  rewardCoins: number;
}
