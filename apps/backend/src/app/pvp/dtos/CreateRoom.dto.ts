import { IsInt, IsString } from "class-validator";

export class CreateRoomDto{
    @IsString()
    heroId: string;

    @IsString()
    heroName: string;

    @IsInt()
    betAmount: number;
}