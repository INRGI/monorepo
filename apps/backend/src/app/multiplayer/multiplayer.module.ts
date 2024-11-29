import { Module } from "@nestjs/common";
import { RedisService } from "./services/redis.service";
import { DuelService } from "./services/duel.service";
import { DuelProcessor } from "./processors/duel.processor";

@Module({
    providers: [RedisService, DuelService, DuelProcessor],
    exports: []
})
export class MultiplayerModule {}