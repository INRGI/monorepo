import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT'],
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  /**
   * Called when a client emits a 'joinRoom' message.
   *
   * Adds the client to the specified room and sends a 'joined' message to all
   * clients in the same room.
   *
   * @param payload The message payload, containing the roomId.
   * @param client The client that sent the message.
   */
  handleJoinRoom(
    @MessageBody() payload: { roomId: string },
    @ConnectedSocket() client: Socket
  ): void {
    client.join(payload.roomId);
    client
      .to(payload.roomId)
      .emit('joined', `User has joined room: ${payload.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  /**
   * Called when a client emits a 'sendMessage' message.
   *
   * Saves the message to the Redis database and sends a 'newMessage' message to
   * all clients in the same room.
   *
   * @param payload The message payload, containing the roomId, senderId, and message.
   * @param client The client that sent the message.
   */
  async handleMessage(
    @MessageBody()
    payload: { roomId: string; senderId: string; message: string },
    @ConnectedSocket() client: Socket
  ): Promise<void> {
  
    await this.chatService.sendMessage(
      payload.roomId,
      payload.senderId,
      payload.message
    );
    this.server.to(payload.roomId).emit('newMessage', payload);
  }
}
