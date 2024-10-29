import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateSkillDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    skillType: string;

    @IsOptional()
    @IsInt()
    damage?: number;

    @IsOptional()
    @IsInt()
    healing?: number;

    @IsInt()
    cooldown: number;
}