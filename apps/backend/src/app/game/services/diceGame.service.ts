import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { HeroInterface } from "@org/users";
import { Queue, QueueEvents } from "bullmq";


@Injectable()
export class DiceGameService {
    private queueEvents: QueueEvents

    constructor(@InjectQueue('dice') private readonly diceQueue: Queue){
        this.queueEvents = new QueueEvents('dice')
    }

    async play(character: HeroInterface, betAmount: number): Promise<any>{
        const job = await this.diceQueue.add('play', {character, betAmount});
        const result = await job.waitUntilFinished(this.queueEvents);
        return result;
    }
}