import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() payload: { roomId: string }): void {
    this.server
      .to(payload.roomId)
      .emit('joined', `User has joined room: ${payload.roomId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody()
    payload: {
      roomId: string;
      senderId: string;
      message: string;
    }
  ): Promise<void> {
    await this.chatService.sendMessage(
      payload.roomId,
      payload.senderId,
      payload.message
    );
    this.server.to(payload.roomId).emit('message', payload);
  }

  @SubscribeMessage('getMessage')
  async handleGetMessage(@MessageBody() payload: { roomId: string }) {
    const result = await this.chatService.getMessages(payload.roomId);
    const messages = result.map((msg: string) => {
      const [senderId, message] = msg.split(': ');
      return { senderId, message };
    });
    this.server.to(payload.roomId).emit('messages', messages);
  }
}
