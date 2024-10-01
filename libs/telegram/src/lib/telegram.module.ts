import { Module } from '@nestjs/common';
import { serviceProviders } from './providers/telegram.providers';
import { ConfigurableModuleClass } from './telegram.module-definition';

@Module({
  controllers: [],
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class TelegramModule extends ConfigurableModuleClass {}
