import { Controller, Get } from '@nestjs/common';
import { InjectGoogleDrive } from '@org/google-drive';
import { GoogleDriveService } from '@org/google-drive';

@Controller()
export class AppController {
  constructor(
    @InjectGoogleDrive() 
    private readonly googleDriveService: GoogleDriveService
  ) {}

  @Get('files')
  async getFiles() {
    const files = await this.googleDriveService.getFiles();
    return files;
  }
}
