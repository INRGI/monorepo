import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  Post,
  Body,
} from '@nestjs/common';
import { GoogleDriveService } from './google-drive-api.service';
import StringSimilarity from 'string-similarity';

@Controller('google-drive')
export class GoogleDriveController {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  @Get(':productName')
  async getProductStatus(
    @Param('productName') productName: string,
    @Headers('Authorization') authHeader: string
  ) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Access token is missing or invalid');
    }

    const accessToken = authHeader.split(' ')[1];

    try {
      const copyName = productName.match(/[a-zA-Z]+/)[0];
      const liftName = productName.match(/[a-zA-Z]+(\d+)/)[1];

      const productFolder = await this.googleDriveService.getProductFolder(
        copyName,
        accessToken
      );
      const subFolder = await this.googleDriveService.getSubFolder(
        productFolder.id,
        accessToken
      );
      const liftFolder = await this.googleDriveService.getLiftFolder(
        subFolder.id,
        liftName,
        accessToken
      );
      const htmlFile = await this.googleDriveService.getHtmlFile(
        liftFolder.id,
        accessToken
      );
      const fileContent = await this.googleDriveService.getFileContent(
        htmlFile.id,
        accessToken
      );

      return { content: fileContent };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Post('compare')
  async checkStrings(@Body() data: { original: string; modified: string }) {
    return StringSimilarity.compareTwoStrings(data.original, data.modified);
  }
}
