import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PvpService } from './services/pvp.service';
import { ChooseTypeDto } from './dtos/ChooseType.dto';
import { RedisService } from '../chat/redis.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT'],
  },
})
export class PvpGateway {
  @WebSocketServer() server: Server;

  constructor(
    private readonly pvpService: PvpService,
  ) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; heroId: string }
  ) {
    const ifJoined = await this.pvpService.joinRoom(payload);
    if (ifJoined) {
      client.join(payload.roomId);
      client.to(payload.roomId).emit('playerJoined', { heroId: payload.heroId });
    }
  }

  @SubscribeMessage('choose')
  async handleChooseType(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChooseTypeDto
  ) {
    const result = await this.pvpService.chooseType(payload);
    if (result) {
      client.emit('choiceConfirmed', { success: true });
    }
  }

  @SubscribeMessage('concede')
  async handleConcede(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; heroId: string }
  ) {
    const result = await this.pvpService.conside(payload);
    client.to(payload.roomId).emit('opponentConceded');
  }
}
