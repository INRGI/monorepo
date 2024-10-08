import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SlackBotServicePort } from './slack-bot.service.port';

import { SlackBotTokens } from '../slack-bot.tokens';
import {
  App,
  FileSharedEvent,
  Middleware,
  SlackActionMiddlewareArgs,
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
    this.slackBotApp.command('/validate', this.handleOpenValidationView);
    this.slackBotApp.action(
      'validation_type_internal_contacts',
      this.handleValidationSelection
    );
    this.slackBotApp.action(
      'validation_type_internal',
      this.handleValidationSelection
    );
    this.slackBotApp.action(
      'validation_type_partner_contacts',
      this.handleValidationSelection
    );
    this.slackBotApp.action(
      'validation_type_partner',
      this.handleValidationSelection
    );

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
      if (event.user_id === this.options.appUserId) return;

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

  private handleOpenValidationView: Middleware<SlackCommandMiddlewareArgs> =
    async ({ ack, client, body }) => {
      await ack();

      await client.chat.postMessage({
        channel: body.channel_id,
        text: 'Please select a validation type:',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Please select a validation type:*',
            },
          },
          {
            type: 'actions',
            block_id: 'validation_type_block',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'INTERNAL_VALIDATION_CONTACTS',
                },
                value: 'INTERNAL_VALIDATION_CONTACTS',
                action_id: 'validation_type_internal_contacts',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'INTERNAL_VALIDATION',
                },
                value: 'INTERNAL_VALIDATION',
                action_id: 'validation_type_internal',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'PARTNER_VALIDATION_CONTACTS',
                },
                value: 'PARTNER_VALIDATION_CONTACTS',
                action_id: 'validation_type_partner_contacts',
              },
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'PARTNER_VALIDATION',
                },
                value: 'PARTNER_VALIDATION',
                action_id: 'validation_type_partner',
              },
            ],
          },
        ],
      });
    };

  private handleValidationSelection: Middleware<SlackActionMiddlewareArgs> =
    async ({ ack, body, client, action }) => {
      await ack();

      const selectedValidationType = (action as any).value;
      if (!body.channel?.id) return;
      await client.chat.postMessage({
        channel: body.channel.id,
        text: `You selected *${selectedValidationType}*. Please upload a CSV file for validation.`,
      });
    };

  private handleTimeCommand: Middleware<SlackCommandMiddlewareArgs> = async ({
    ack,
    respond,
  }) => {
    await ack();
    await respond(`Time now is ${Date.now()}`);
  };
}
