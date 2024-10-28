import { IsInt, IsString } from 'class-validator';

export class CreateQuestDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  taskType: string;

  @IsInt()
  targetAmount: number;

  @IsInt()
  rewardCoins: number;
}