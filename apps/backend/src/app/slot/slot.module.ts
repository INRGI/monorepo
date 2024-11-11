import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotGateway } from './slot.gateway';
import { UsersModule } from '@org/users';

@Module({
  providers: [SlotService, SlotGateway],
  imports: [UsersModule]
})
export class SlotModule {}
