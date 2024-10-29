import { IsInt, IsString } from "class-validator";

export class LevelUpSkillDto {
    @IsString()
    heroId: string;

    @IsInt()
    skillId: number;
}