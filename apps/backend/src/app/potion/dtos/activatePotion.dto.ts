import { IsString } from "class-validator";

export class ActivatePotionDto{
    @IsString()
    heroId: string;

    @IsString()
    potionId: string;
}