import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SlotService } from './slot.service';
import { PlaySlotDto } from './play-slot.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SlotGateway {
  @WebSocketServer()
  server;

  constructor(private readonly slotService: SlotService) {}

  @SubscribeMessage('play')
  async handlePlay(
    @MessageBody() playSlotDto: PlaySlotDto,
    @ConnectedSocket() client: Socket
  ): Promise<any> {
    const { bet, heroId } = playSlotDto;

    const { result, win } = await this.slotService.play(bet, heroId);

    client.emit('playResult', { result, win });
  }
}
