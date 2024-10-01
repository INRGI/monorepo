import { ConfigurableModuleBuilder } from "@nestjs/common";
import { GeminiTokens } from "./gemini.tokens";
import { GeminiOptions } from "./interfaces";

export const {ConfigurableModuleClass} = new ConfigurableModuleBuilder<GeminiOptions>({
    optionsInjectionToken: GeminiTokens.GeminiModuleOptions,
}).build();