import { Module } from '@nestjs/common';
import { MonstersService } from './monster.service';

@Module({
  providers: [MonstersService],
  exports: [MonstersService],
})
export class MonstersModule {}
