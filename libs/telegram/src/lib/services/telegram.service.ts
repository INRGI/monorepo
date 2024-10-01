import { Inject, Logger } from '@nestjs/common';
import { TelegramServicePort } from './telegram.service.port';
import { TelegramTokens } from '../telegram.tokens';
import { TelegramOptions } from '../interfaces';
import { Telegraf } from 'telegraf';
import OpenAI from 'openai';

export class TelegramService implements TelegramServicePort {
  private readonly logger = new Logger(TelegramService.name);
  private bot: Telegraf;
  private openai: OpenAI;

  constructor(
    @Inject(TelegramTokens.TelegramModuleOptions)
    private readonly options: TelegramOptions
  ) {
    this.bot = new Telegraf(this.options.token);

    this.openai = new OpenAI({ apiKey: this.options.openAI });
    this.initializeBot();
  }

  private initializeBot() {
    this.bot.on('message', async (ctx) => {
      if (ctx.message && 'text' in ctx.message) {
        const userMessage = ctx.message.text;
        const aiResponse = await this.getAIResponse(userMessage);
        ctx.reply(aiResponse);
      } else {
        ctx.reply('Please put a text message.');
      }
    });

    this.bot.launch();
  }

  private async getAIResponse(prompt: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{
          "role": "system",
          "content": "Your task is speak with user and make up the conversation"
        },{ "role": 'user', "content": prompt }],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });
      if (response.choices && response.choices.length > 0) {
        const messageContent = response.choices[0].message.content;
        if (messageContent) {
          return messageContent.trim();
        }
      }
  
      return 'Sorry, I am unable to process your request right now.';
    } catch (error) {
        this.logger.error('Error from OpenAI:', error);
      return 'Sorry, I am unable to process your request right now.';
    }
  }

  public async sendMessage(chatId: string, message: string): Promise<any> {
    return await this.bot.telegram.sendMessage(chatId, message);
  }
}
