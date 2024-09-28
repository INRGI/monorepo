import { FactoryProvider } from '@nestjs/common';
import { GoogleDriveTokens } from '../google-drive.tokens';
import { GoogleDriveOptions } from '../interfaces';
import { GoogleDriveService } from '../services/google-drive.service';

export const serviceProviders: FactoryProvider[] = [
  {
    provide: GoogleDriveTokens.GoogleDriveService,
    useFactory: (options: GoogleDriveOptions) => {
      return new GoogleDriveService(options);
    },
    inject: [GoogleDriveTokens.GoogleDriveModuleOptions],
  },
];