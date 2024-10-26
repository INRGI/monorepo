import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateQuestDto{
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
    taskType?: string;

    @IsOptional()
    @IsInt()
    targetAmount?: number;

    @IsOptional()
    @IsInt()
    rewardCoins?: number;
}