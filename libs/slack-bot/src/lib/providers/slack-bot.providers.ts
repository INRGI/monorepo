import { SlackBotTokens } from '../slack-bot.tokens';
import { SlackBotOptions } from '../interfaces';

import { App } from '@slack/bolt';

export const botProvider = {
  provide: SlackBotTokens.SlackBotApp,
  useFactory: (options: SlackBotOptions) => {
    return new App({
      signingSecret: options.signingSecret,
      token: options.token,
      socketMode: true,
      appToken: options.appToken,
    });
  },
  inject: [SlackBotTokens.SlackBotTokensModuleOptions],
};
