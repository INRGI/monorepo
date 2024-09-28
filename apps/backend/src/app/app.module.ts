import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GameModule } from './game/game.module';
import { AuthModule } from '@org/auth';
import { GoogleDriveModule, GoogleDriveService } from '@org/google-drive';

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
    GoogleDriveModule.register({
      client_email: process.env.GOOGLE_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_PRIVATE_KEY!
    }
    ),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleDriveService],
})
export class AppModule {}
