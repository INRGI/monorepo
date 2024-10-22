import { IsInt, IsString } from 'class-validator';

export class InviteToGuildDto {
  @IsInt()
  id: number;

  @IsString()
  heroId: string;
}
