import { IsString } from "class-validator";

export class CreateGuildDto{
    @IsString()
    name: string;

    @IsString()
    guildMastersId: string;
}