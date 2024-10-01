import { Inject } from "@nestjs/common";
import { TelegramTokens } from "../telegram.tokens";

export const InjectTelegram = (): ReturnType<typeof Inject> => Inject(TelegramTokens.TelegramService);