import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SlackBotServicePort } from './slack-bot.service.port';

import { SlackBotTokens } from '../slack-bot.tokens';
import {
  App,
  FileSharedEvent,
  Middleware,
  SlackCommandMiddlewareArgs,
  SlackEventMiddlewareArgs,
} from '@slack/bolt';
import * as fs from 'fs/promises';
import axios from 'axios';
import { SlackBotOptions } from '../interfaces';

@Injectable()
export class SlackBotService implements SlackBotServicePort, OnModuleInit {
  private readonly logger = new Logger(SlackBotService.name);

  constructor(
    @Inject(SlackBotTokens.SlackBotApp)
    private readonly slackBotApp: App,
    @Inject(SlackBotTokens.SlackBotTokensModuleOptions)
    private readonly options: SlackBotOptions
  ) {}

  async onModuleInit() {
    await this.botInitialize();
  }

  private async botInitialize() {
    try {
      await this.slackBotApp.start();

      this.registerEventHandlers();
    } catch (error) {
      this.logger.error('Failed to start Slack Bot', error);
    }
  }

  private registerEventHandlers(): void {
    this.slackBotApp.event('file_shared', this.handleCSVSharedEvent);
    this.slackBotApp.command('/time', this.handleTimeCommand);
    // this.slackBotApp.message(this.handleMessageEvent.bind(this));
  }

  private handleMessageEvent: Middleware<SlackEventMiddlewareArgs<'message'>> =
    async ({ message, say }) => {
      if (message && 'text' in message) {
        const text = message.text;
        await say(`You mean: ${text}?`);
      }
    };

  private handleCSVSharedEvent: Middleware<
    SlackEventMiddlewareArgs<'file_shared'>
  > = async ({ event, client }) => {
    try {
      if(event.user_id === this.options.appUserId) return;

      const { file, channel_id } = event as FileSharedEvent;
      
      const fileInfo = await client.files.info({
        file: file.id,
      });

      if (!fileInfo.file || !fileInfo.file.url_private) {
        this.logger.error(`File info has a wrong value: ${file.id}`);
        return;
      }

      const fileType = fileInfo.file.filetype;

      if (fileType === 'csv') {
        const fileUrl = fileInfo.file.url_private;

        const response = await axios.get(fileUrl, {
          headers: {
            Authorization: `Bearer ${this.options.token}`,
          },
          responseType: 'arraybuffer',
        });

        const newFileName = `validated.csv`;
        await fs.writeFile(`/tmp/${newFileName}`, response.data);
        await client.files.uploadV2({
          channel_id,
          title: newFileName,
          filename: newFileName,
          file: `/tmp/${newFileName}`,
        });
      }
    } catch (error) {
      this.logger.error(error);
    }
  };

  private handleTimeCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
    ack,
    respond,
  }) => {
    await ack();
    await respond(`Time now is ${Date.now()}`);
  };
}
