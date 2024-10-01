import { FactoryProvider } from "@nestjs/common";
import { GeminiTokens } from "../gemini.tokens";
import { GeminiOptions } from "../interfaces";
import { GeminiService } from "../services";



export const serviceProviders: FactoryProvider[] = [{
    provide: GeminiTokens.GeminiService,
    useFactory: (options: GeminiOptions) => {
        return new GeminiService(options);
    },
    inject: [GeminiTokens.GeminiModuleOptions],
}];