import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { AuthModule } from '@org/auth';
import { GoogleDriveModule } from '@org/google-drive';
import { TelegramModule } from '@org/telegram';
import { GeminiModule } from '@org/gemini';
import { UnsplashModule } from '@org/unsplash';
import { SlackBotModule } from '@org/slack-bot';
import { ItemModule } from './loot/loot.module';

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
    // GoogleDriveModule.register({
    //   client_email: process.env.GOOGLE_CLIENT_EMAIL!,
    //   private_key: process.env.GOOGLE_PRIVATE_KEY!
    // }),
    // UnsplashModule.register({
    //   accessKey: process.env.UNSPLASH_ACCESS_KEY
    // }),
    // TelegramModule.register({
    //   token: process.env.TELEGRAM_BOT_KEY,
    //   openAI: process.env.OPENAI_KEY
    // }),
    // GeminiModule.register({
    //   token: process.env.TELEGRAM_BOT_KEY,
    //   geminiKey : process.env.GEMINI_KEY
    // }),
    SlackBotModule.register({
      token: process.env.SLACK_BOT_OAUTH_TOKEN,
      signingSecret : process.env.SLACK_SIGNING_SECRET,
      appToken: process.env.SLACK_BOT_APP_TOKEN,
      appUserId: process.env.SLACK_USER_ID,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
