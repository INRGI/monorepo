import { ConfigurableModuleBuilder } from '@nestjs/common';
import { GoogleDriveOptions } from './interfaces';
import { GoogleDriveTokens } from './google-drive.tokens';

export const { ConfigurableModuleClass } =
  new ConfigurableModuleBuilder<GoogleDriveOptions>({
    optionsInjectionToken: GoogleDriveTokens.GoogleDriveModuleOptions,
  }).build();