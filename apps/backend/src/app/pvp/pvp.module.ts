import { Module } from '@nestjs/common';
import { PvpGateway } from './pvp.gateway';
import { PvpService } from './services/pvp.service';
import { BullModule } from '@nestjs/bullmq';
import { PvpProcessor } from './processors/pvp.processor';
import { RedisService } from './services/redis.service';
import { PvpController } from './controllers/pvp.controller';
import { DatabaseModule } from '../database/database.module';
import { pvpProviders } from './providers/pvp.providers';
import { UsersModule } from '@org/users';

@Module({
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
      name: 'pvp',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [...pvpProviders,PvpGateway, PvpService, PvpProcessor, RedisService],
  controllers: [PvpController],
  exports: [...pvpProviders]
})
export class PvpModule {}
