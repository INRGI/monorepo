import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ChatService } from './chat.service';
import { ChatProcessor } from './chat.processor';
import { RedisService } from './redis.service';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'chat',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [
    ChatService,
    ChatProcessor,
    RedisService,
    ChatGateway,
  ],
})
export class ChatModule {}
