import { Controller, Get } from '@nestjs/common';
// import { InjectGoogleDrive } from '@org/google-drive';
// import { GoogleDriveService } from '@org/google-drive';
import {InjectUnsplash, UnsplashService} from '@org/unsplash';

@Controller()
export class AppController {
  constructor(
    // @InjectGoogleDrive() 
    // private readonly googleDriveService: GoogleDriveService
    @InjectUnsplash()
    private readonly unsplashService: UnsplashService
  ) {}

  @Get('randomPhoto')
  async randomPhoto() {
    const photo = await this.unsplashService.getRandomPhoto();
    return photo;
  }

  // @Get('files')
  // async getFiles() {
  //   const files = await this.googleDriveService.getFiles();
  //   return files;
  // }
}
