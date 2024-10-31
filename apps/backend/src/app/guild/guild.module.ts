import { Module } from '@nestjs/common';
import { guildProviders } from './providers/guild.providers';
import { BullModule } from '@nestjs/bullmq';
import { GuildProcessor } from './processors/guild.processor';
import { GuildService } from './services/guild.service';
import { GuildController } from './controllers/guild.controller';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '@org/users';
import { GuildBossProcessor } from './processors/guildBoss.processor';
import { GuildBossController } from './controllers/guildBoss.controller';
import { GuildBossService } from './services/guildBoss.service';

@Module({
  providers: [...guildProviders, GuildProcessor, GuildService, GuildBossProcessor, GuildBossService],
  controllers: [GuildController, GuildBossController],
  imports: [
    DatabaseModule,
    UsersModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'guild',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'quests',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'guild-boss',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  exports: [...guildProviders],
})
export class GuildModule {}
