import { Inject } from "@nestjs/common";
import { SlackBotTokens } from "../slack-bot.tokens";

export const InjectSlackBotPostmaster = (): ReturnType<typeof Inject> =>
  Inject(SlackBotTokens.SlackBotTokensService);