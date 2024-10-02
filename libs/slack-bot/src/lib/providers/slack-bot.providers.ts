import { FactoryProvider } from "@nestjs/common";
import { SlackBotTokens } from "../slack-bot.tokens";
import { SlackBotOptions } from "../interfaces";
import { SlackBotService } from "../services";

export const serviceProviders: FactoryProvider[] = [
    {
      provide: SlackBotTokens.SlackBotTokensService,
      useFactory: (options: SlackBotOptions) => {
        return new SlackBotService(options);
      },
      inject: [SlackBotTokens.SlackBotTokensModuleOptions],
    },
  ];