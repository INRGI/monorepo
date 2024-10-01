import { Module } from '@nestjs/common';
import { serviceProviders } from './providers/gemini.providers';
import { ConfigurableModuleClass } from './gemini.module-definition';

@Module({
  controllers: [],
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class GeminiModule extends ConfigurableModuleClass {}
