import { Module } from "@nestjs/common";
import { guildProviders } from "./providers/guild.providers";
import { BullModule } from "@nestjs/bullmq";
import { GuildProcessor } from "./processors/guild.processor";
import { GuildService } from "./services/guild.service";
import { GuildController } from "./controllers/guild.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
    providers: [...guildProviders, GuildProcessor, GuildService],
    controllers: [GuildController],
    imports: [
        DatabaseModule,
        BullModule.forRoot({
            connection: {
                host: 'localhost',
                port: 6379,
            }
        }),
        BullModule.registerQueue({
            name: 'guild',
            connection: {
              host: 'localhost',
              port: 6379,
            },
          }),
    ],
    exports: [...guildProviders]
})
export class GuildModule{}