import { ConfigurableModuleBuilder } from "@nestjs/common";
import { TelegramOptions } from "./interfaces";
import { TelegramTokens } from "./telegram.tokens";

export const {ConfigurableModuleClass} = new ConfigurableModuleBuilder<TelegramOptions>({
    optionsInjectionToken: TelegramTokens.TelegramModuleOptions,
}).build();