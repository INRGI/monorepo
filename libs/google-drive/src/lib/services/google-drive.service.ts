import { Inject, Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { GoogleDriveTokens } from '../google-drive.tokens';
import { GoogleDriveOptions } from '../interfaces';
import { GoogleDriveServicePort } from './google-drive.service.port';

@Injectable()
export class GoogleDriveService implements GoogleDriveServicePort {
  private drive!: drive_v3.Drive;

  constructor(
    @Inject(GoogleDriveTokens.GoogleDriveModuleOptions)
    private readonly options: GoogleDriveOptions
  ) {
    this.initializeClient();
  }

  private async initializeClient() {
    const auth = await google.auth.getClient({
      credentials: {
        client_email: this.options.client_email,
        private_key: this.options.private_key.replace(/\\n/gm, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
    
    this.drive = google.drive({ version: 'v3', auth });
  }

  async getFiles(): Promise<drive_v3.Schema$File[]> {
    const res = await this.drive.files.list({
      pageSize: 10,
      fields: 'files(id, name)',
    });
    return res.data.files || [];
  }

  async getFile(fileId: string): Promise<drive_v3.Schema$File> {
    const res = await this.drive.files.get({
      fileId: fileId,
      alt: 'media',
    });
    return res.data;
  }

  async getFolderContents(folderId: string): Promise<drive_v3.Schema$File[]> {
    const res = await this.drive.files.list({
      q: `'${folderId}' in parents`,
      fields: 'files(id, name)',
    });
    return res.data.files || [];
  }

  async createTestFile(fileName: string, mimeType: string): Promise<string> {
    const fileMetadata = {
      name: fileName,
      mimeType: mimeType,
    };

    const res = await this.drive.files.create({
      requestBody: fileMetadata,
      fields: 'id',
    });

    return res.data.id || '';
  }
}
