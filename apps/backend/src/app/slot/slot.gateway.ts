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
  /**
   * Handles a client playing a round of the slot machine.
   *
   * The client sends a 'play' event with a {@link PlaySlotDto} object that contains the amount to bet and the ID of the hero to play with.
   *
   * The server then plays a round of the slot machine with the given bet and hero.
   *
   * The result of the round is then sent back to the client in a 'playResult' event with an object that contains the result and the amount won.
   */
  async handlePlay(
    @MessageBody() playSlotDto: PlaySlotDto,
    @ConnectedSocket() client: Socket
  ): Promise<any> {
    const { bet, heroId } = playSlotDto;

    const { result, win } = await this.slotService.play(bet, heroId);

    client.emit('playResult', { result, win });
  }
}
