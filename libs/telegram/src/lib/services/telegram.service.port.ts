
export interface TelegramServicePort {
    sendMessage(chatId: string, message: string): Promise<any>;
}