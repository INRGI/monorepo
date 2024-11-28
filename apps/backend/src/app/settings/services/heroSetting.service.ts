import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue, QueueEvents } from "bullmq";
import { UpdateHeroSettingDto } from "../dtos/updateHeroSetting.dto";

@Injectable()
export class HeroSettingService {
    private queueEvents: QueueEvents;

    constructor(
        @InjectQueue('heroSetting') private readonly heroSettingQueue: Queue
    ) {
        this.queueEvents = new QueueEvents('heroSetting');
    }

    async getHeroSettingJob(heroId: string) {
        const job = await this.heroSettingQueue.add('get-hero-setting', {heroId});
        const result = await job.waitUntilFinished(this.queueEvents);
        return result;
    }

    async updateHeroSettingJob(updateHeroSettingDto: UpdateHeroSettingDto) {
        const job = await this.heroSettingQueue.add('update-hero-setting', updateHeroSettingDto);
        const result = await job.waitUntilFinished(this.queueEvents);
        return result;
    }
}