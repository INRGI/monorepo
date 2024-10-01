import { FactoryProvider } from "@nestjs/common";
import { TelegramTokens } from "../telegram.tokens";
import { TelegramOptions } from "../interfaces";
import { TelegramService } from "../services/telegram.service";


export const serviceProviders: FactoryProvider[] = [{
    provide: TelegramTokens.TelegramService,
    useFactory: (options: TelegramOptions) => {
        return new TelegramService(options);
    },
    inject: [TelegramTokens.TelegramModuleOptions],
}];