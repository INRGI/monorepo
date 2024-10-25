import { IsInt, IsOptional, IsString } from "class-validator";

export class UpdateGuildDto{
    @IsInt()
    id: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsString()
    @IsOptional()
    logo?: string;
}