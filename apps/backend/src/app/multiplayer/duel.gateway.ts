import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { DuelService } from './services/duel.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class DuelGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly duelService: DuelService) {}

  handlePlayerMove() {}

  handleSearchOpponent() {}
}
