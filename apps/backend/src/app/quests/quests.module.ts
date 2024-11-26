import { Module } from "@nestjs/common";
import { questsProviders } from "./providers/quests.providers";
import { QuestsService } from "./services/quests.service";
import { QuestsController } from "./controllers/quests.controller";
import { DatabaseModule } from "../database/database.module";
import { BullModule } from "@nestjs/bullmq";
import { QuestsProcessor } from "./processors/quests.processor";
import { UsersModule } from "@org/users";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    providers: [...questsProviders, QuestsService, QuestsProcessor],
    controllers: [QuestsController],
    imports: [
        CacheModule.register(),
        UsersModule,
        DatabaseModule,
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            }
        }),
        BullModule.registerQueue({
            name: 'quests',
            connection: {
              host: 'localhost',
              port: 6379,
            },
          }),
    ],
    exports: [...questsProviders]
})
export class QuestsModule{}