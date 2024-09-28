import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { GoogleDriveService, InjectGoogleDrive } from '@org/google-drive';

@Controller()
export class AppController {
  constructor(@InjectGoogleDrive() private readonly googleDriveService: GoogleDriveService) {}

  @Get('files')
  async getFiles() {
    const files = await this.googleDriveService.getFiles();
    return files;
  }
}
