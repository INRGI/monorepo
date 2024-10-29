import { Module } from '@nestjs/common';
import { skillsProviders } from './providers/skills.providers';
import { DatabaseModule } from '../database/database.module';
import { BullModule } from '@nestjs/bullmq';
import { SkillsProcessor } from './processors/skills.processor';
import { SkillsService } from './services/skills.service';
import { SkillsController } from './controllers/skills.controller';

@Module({
  providers: [...skillsProviders, SkillsProcessor, SkillsService],
  controllers: [SkillsController],
  imports: [
    DatabaseModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'skills',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  exports: [...skillsProviders],
})
export class SkillsModule {}
