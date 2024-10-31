import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateGuildBossDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsInt()
  attack?: number;

  @IsOptional()
  @IsInt()
  health?: number;

  @IsOptional()
  @IsInt()
  rewardCoins?: number;
}
