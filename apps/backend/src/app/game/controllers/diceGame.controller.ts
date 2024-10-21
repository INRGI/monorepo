import { Body, Controller, Post } from "@nestjs/common";
import { DiceGameService } from "../services/diceGame.service";
import { HeroInterface } from "@org/users";

@Controller('dice')
export class DiceGameController {
    constructor(private readonly diceService: DiceGameService){}

    @Post('bet')
    async playDice(@Body() betData: {character: HeroInterface, betAmount: number}){
        return await this.diceService.play(betData.character, betData.betAmount);
    }
}