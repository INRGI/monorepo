import { Module } from '@nestjs/common';
import { PotionService } from './potion.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { PotionInterceptor } from './potion.interceptor';
import { DatabaseModule } from '../database/database.module';
import { potionProviders } from './providers/potion.providers';
import { PotionController } from './potion.controller';
import { BullModule } from '@nestjs/bullmq';

@Module({
  providers: [
    ...potionProviders,
    PotionService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PotionInterceptor,
    },
  ],
  imports: [DatabaseModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'potion',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),],
  controllers: [PotionController],
  exports: [
    ...potionProviders
  ]
})
export class PotionModule {}
