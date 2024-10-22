import { IsInt, IsString } from "class-validator";

export class RemoveFromGuildDto{
    @IsInt()
    id: number;

    @IsString()
    heroId: string; 
}