import { Module } from '@nestjs/common';
import { serviceProviders } from './providers/slack-bot.providers';
import { ConfigurableModuleClass } from './slack-bot.module-definitions';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class SlackBotModule extends ConfigurableModuleClass {}
