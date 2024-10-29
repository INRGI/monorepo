import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateSkillDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  skillType?: string;

  @IsOptional()
  @IsInt()
  damage?: number;

  @IsOptional()
  @IsInt()
  healing?: number;

  @IsOptional()
  @IsInt()
  cooldown?: number;
}
