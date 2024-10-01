import { ConfigurableModuleBuilder } from '@nestjs/common';
import { UnsplashOptions } from './interfaces';
import { UnsplashTokens } from './unsplash.tokens';

export const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<UnsplashOptions>({
    optionsInjectionToken: UnsplashTokens.UnsplashModuleOptions,
  }).build();
