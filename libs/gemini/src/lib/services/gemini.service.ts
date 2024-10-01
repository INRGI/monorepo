import { Inject, Logger } from '@nestjs/common';

import { Telegraf } from 'telegraf';
import { GeminiServicePort } from './gemini.service.port';
import { GeminiTokens } from '../gemini.tokens';
import { GeminiOptions } from '../interfaces';
import { GoogleGenerativeAI } from '@google/generative-ai';

export class GeminiService implements GeminiServicePort {
  private readonly logger = new Logger(GeminiService.name);
  private bot: Telegraf;
  private gemini: GoogleGenerativeAI;

  constructor(
    @Inject(GeminiTokens.GeminiModuleOptions)
    private readonly options: GeminiOptions
  ) {
    this.bot = new Telegraf(this.options.token);

    this.gemini = new GoogleGenerativeAI(this.options.geminiKey);

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
      const model = this.gemini.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });
      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error) {
      this.logger.error(error);
      return 'Sorry, I am unable to process your request right now.';
    }
  }
}
