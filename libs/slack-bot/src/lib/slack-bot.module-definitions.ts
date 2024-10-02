import { ConfigurableModuleBuilder } from "@nestjs/common";
import { SlackBotOptions } from "./interfaces";
import { SlackBotTokens } from "./slack-bot.tokens";

export const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<SlackBotOptions>({
    optionsInjectionToken: SlackBotTokens.SlackBotTokensModuleOptions,
  }).build();