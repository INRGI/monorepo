import { Module } from '@nestjs/common';
import { serviceProviders } from './providers/unsplash.providers';
import { ConfigurableModuleClass } from './unsplash.module-defininition';

@Module({
  controllers: [],
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class UnsplashModule extends ConfigurableModuleClass {}
