import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SlackBotServicePort } from './slack-bot.service.port';

import { SlackBotTokens } from '../slack-bot.tokens';
import {
  App,
  FileSharedEvent,
  Middleware,
  SlackActionMiddlewareArgs,
  SlackCommandMiddlewareArgs,
} from '@slack/bolt';
import * as fs from 'fs/promises';
import{ createReadStream } from 'fs'
import axios from 'axios';
import { SlackBotOptions } from '../interfaces';

@Injectable()
export class SlackBotService implements SlackBotServicePort, OnModuleInit {
  private readonly logger = new Logger(SlackBotService.name);
  private lastStatus: string = 'No info yet';

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
    this.slackBotApp.command('/validate', this.handleOpenValidationView);

    this.slackBotApp.action(
      'validation_type_internal',
      this.handleValidationSelection
    );

    this.slackBotApp.action(
      'validation_type_partner',
      this.handleValidationSelection
    );

    this.slackBotApp.command('/copy-maker', this.handleStatusCommand);
    this.slackBotApp.command('/set-status', this.handleSetStatusCommand);
  }

  private handleStatusCommand: Middleware<SlackCommandMiddlewareArgs> = async ({ack, client, body}) => {
    await ack();

    await client.chat.postMessage({
      channel: body.channel_id,
      text: `The last update of CopyMaker was: ${this.lastStatus}`
    })
  };

  private handleSetStatusCommand: Middleware<SlackCommandMiddlewareArgs> = async ({ack, client, body}) => {
    await ack();

    if(body.user_id !== 'U07PV0F8UKU'){
      await client.chat.postMessage({
        channel: body.channel_id,
        text: 'Sorry, you do not have permissions'
      });
      return;
    };

    const newStatus = body.text.trim();
    if(!newStatus) {
      await client.chat.postMessage({
        channel: body.channel_id,
        text: 'Please provide correct status'
      });
      return;
    }

    this.lastStatus = newStatus;

    await client.chat.postMessage({
      channel: body.channel_id,
      text: `Status updated to: ${newStatus}`
    });
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
                  text: 'INTERNAL_VALIDATION',
                },
                value: 'INTERNAL_VALIDATION',
                action_id: 'validation_type_internal',
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

      this.handleCSVUpload(selectedValidationType, body.channel.id);
    };

  private handleCSVUpload = async (
    validationType: string,
    channelId: string
  ) => {
    this.slackBotApp.event('file_shared', async ({ event, client }) => {
      try {
        if (event.user_id === this.options.appUserId) return;
        const { file, event_ts } = event as FileSharedEvent;
        
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
          const fileStats = await fs.stat(`/tmp/${newFileName}`)

          const uploadURLResponse = await client.files.getUploadURLExternal({
            filename: newFileName,
            length: fileStats.size,
          });

          const uploadURL = uploadURLResponse.upload_url;
          if(!uploadURL) return;
          const fileId = uploadURLResponse.file_id;
          if(!fileId) return;

          await axios.post(uploadURL, createReadStream(`/tmp/${newFileName}`), {
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          });

          await client.files.completeUploadExternal({
            files: [{
                id: fileId,
                title: `${newFileName} (${validationType})`
            }],
            channel_id: channelId,
            thread_ts: event_ts
        });
        }
      } catch (error) {
        this.logger.error(error);
      }
    });
  };
}
