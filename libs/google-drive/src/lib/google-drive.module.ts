import { Module } from '@nestjs/common';
import { ConfigurableModuleClass } from './google-drive.module-definitions';
import { serviceProviders } from './providers/google-drive.providers';

@Module({
  providers: [...serviceProviders],
  exports: [...serviceProviders],
})
export class GoogleDriveModule extends ConfigurableModuleClass{};