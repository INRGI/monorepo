import { IsNumber, IsString } from "class-validator";

export class ActivatePotionDto{
    @IsString()
    heroId: string;

    @IsNumber()
    potionId: number;
}