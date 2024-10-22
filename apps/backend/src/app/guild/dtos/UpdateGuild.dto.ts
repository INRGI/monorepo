import { IsInt, IsString } from "class-validator";

export class UpdateGuildDto{
    @IsInt()
    id: number;

    @IsString()
    name?: string;
}