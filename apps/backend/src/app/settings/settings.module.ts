import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database/database.module";
import { settingsProviders } from "./providers/settings.providers";
import { BullModule } from "@nestjs/bullmq";
import { HeroSettingService } from "./services/heroSetting.service";
import { HeroSettingController } from "./controllers/heroSetting.controller";
import { HeroSettingProcessor } from "./processors/heroSetting.processor";

@Module({
    imports: [
        DatabaseModule,
        BullModule.forRoot({
            connection: {
              host: 'localhost',
              port: 6379,
            },
          }),
          BullModule.registerQueue({
            name: 'heroSetting',
            connection: {
              host: 'localhost',
              port: 6379,
            },
          }),
    ],
    controllers: [HeroSettingController],
    providers: [...settingsProviders, HeroSettingService, HeroSettingProcessor],
    exports: [...settingsProviders]
})
export class SettingsModule {}