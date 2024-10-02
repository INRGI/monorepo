import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SlackBotServicePort } from './slack-bot.service.port';
import { SlackBotOptions } from '../interfaces';
import { App } from '@slack/bolt';
import { SlackBotTokens } from '../slack-bot.tokens';

@Injectable()
export class SlackBotService implements SlackBotServicePort, OnModuleInit {
  private readonly logger = new Logger(SlackBotService.name);
  private bot: App;

  constructor(
    @Inject(SlackBotTokens.SlackBotTokensModuleOptions)
    private readonly options: SlackBotOptions
  ) {
    this.bot = new App({
        signingSecret: this.options.signingSecret,
        token: this.options.token,
        socketMode:true,
        appToken: this.options.appToken
    })
  }

  async onModuleInit() {
      await this.botInitialize();
  }

  private async botInitialize() {
    try {
      await this.bot.start();

      this.bot.message(async ({ message, say }) => {
        if (message && 'text' in message) {
          const text = message.text;
          await say(`You mean: ${text}?`);
        }
      });

      this.bot.command('/time', async ({ack, respond}) => {
        await ack();
        await respond(`Time now is ${Date.now()}`);
      });

    } catch (error) {
      this.logger.error('Failed to start Slack Bot', error);
    }
  }
}
