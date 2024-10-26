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

// [
//   {
//     name: 'Defeat the monster',
//     description: 'Defeat the monster in a game',
//     rewardCoins: '100',
//     taskType: 'battle',
//     status: 'active',
//     targetAmount: 1,
//   },
// ];
