import { DynamicModule, Module } from '@nestjs/common';
import { botProvider } from './providers/slack-bot.providers';
import { ConfigurableModuleClass} from './slack-bot.module-definitions';
import { SlackBotOptions } from './interfaces';
import { SlackBotTokens } from './slack-bot.tokens';
import { SlackBotService } from './services';

@Module({})
export class SlackBotModule extends ConfigurableModuleClass {
  static register(options: SlackBotOptions): DynamicModule {
    return {
      module: SlackBotModule,
      providers: [
        {
          provide: SlackBotTokens.SlackBotTokensModuleOptions,
          useValue: options,
        },
        botProvider,
        SlackBotService,
      ],
      exports: [SlackBotService, botProvider], 
    };
  }
}
