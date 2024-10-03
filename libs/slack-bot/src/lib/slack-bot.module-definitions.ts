import { ConfigurableModuleBuilder } from "@nestjs/common";
import { SlackBotOptions } from "./interfaces";
import { SlackBotTokens } from "./slack-bot.tokens";

export const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<SlackBotOptions>({
    optionsInjectionToken: SlackBotTokens.SlackBotTokensModuleOptions,
  }).build();