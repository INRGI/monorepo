import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { AuthModule } from '@org/auth';
import { ItemModule } from './loot/loot.module';
import { ChatModule } from './chat/chat.module';
import { GuildModule } from './guild/guild.module';
import { AuctionModule } from './auction/auction.module';
import { QuestsModule } from './quests/quests.module';
import { SkillsModule } from './skills/skills.module';
import { SlotModule } from './slot/slot.module';
import { MondayApiModule } from './monday-api/monday-api.module';
// import { GoogleDriveModule } from './google-drive-api/google-drive-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URL'),
      }),
      inject: [ConfigService],
    }),
    GameModule,
    AuthModule,
    ItemModule,
    GuildModule,
    AuctionModule,
    QuestsModule,
    SkillsModule,
    ChatModule,
    SlotModule,
    MondayApiModule,
    // GoogleDriveModule
  ],
  controllers: [AppController,],
  providers: [AppService],
})
export class AppModule {}
