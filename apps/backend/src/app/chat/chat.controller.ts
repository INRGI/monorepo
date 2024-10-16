import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService){}

    @Post(':roomId/send')
    async sendMessage(
        @Param('roomId') roomId: string,
        @Body('senderId') senderId: string,
        @Body('message') message: string,
    ){
        await this.chatService.sendMessage(roomId, senderId, message);
        return {status: 'Message sent'}
    }

    @Get(':roomId/messages')
    async getMessages(@Param('roomId') roomId: string,){
        return await this.chatService.getMessages(roomId);
    }
}