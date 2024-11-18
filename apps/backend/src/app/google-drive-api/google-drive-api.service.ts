import { Injectable } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class GoogleDriveService {
  private authClient: OAuth2Client;

  constructor() {
    const CLIENT_ID =
      '1042942150757-2q0dlbnb2ti5dhu68nf8bia7eusuj795.apps.googleusercontent.com';
    const CLIENT_SECRET = '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';
    const REDIRECT_URI = 'https://copy-maker.vercel.app';

    this.authClient = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
  }
  private async initializeDrive(accessToken: string): Promise<drive_v3.Drive> {
    this.authClient.setCredentials({ access_token: accessToken });
    return google.drive({ version: 'v3', auth: this.authClient });
  }

  async getProductFolder(copyName: string, accessToken: string): Promise<drive_v3.Schema$File> {
    const drive = await this.initializeDrive(accessToken);

    const productQuery = `name contains '${copyName}' and mimeType = 'application/vnd.google-apps.folder'`;

    const res = await drive.files.list({
      q: productQuery,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (res.data.files.length === 0) {
      throw new Error('No product folder found with the specified name.');
    }

    const cleanFolderName = (name: string) =>
      name.replace(/[^\w\s]/g, '').split(' ')[0].trim();

    const productFolder = res.data.files.find(
      (file) => cleanFolderName(file.name) === copyName,
    );

    if (!productFolder) {
      throw new Error('No exact product folder found with the specified name.');
    }

    return productFolder;
  }

  async getSubFolder(productFolderId: string, accessToken: string): Promise<drive_v3.Schema$File> {
    const drive = await this.initializeDrive(accessToken);

    const subFolderQuery = `'${productFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name contains 'HTML+SL'`;

    const subFolderRes = await drive.files.list({
      q: subFolderQuery,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (subFolderRes.data.files.length === 0) {
      throw new Error("No 'HTML+SL' subfolder found.");
    }

    return subFolderRes.data.files[0];
  }

  async getLiftFolder(subFolderId: string, liftName: string, accessToken: string): Promise<drive_v3.Schema$File> {
    const drive = await this.initializeDrive(accessToken);

    const liftFolderQuery = `'${subFolderId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name contains 'Lift '`;

    const liftFolderRes = await drive.files.list({
      q: liftFolderQuery,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (liftFolderRes.data.files.length === 0) {
      throw new Error(`No "Lift ${liftName}" subfolder found.`);
    }

    const liftNumber = liftName.match(/\d+/)[0];
    const filteredFiles = liftFolderRes.data.files.filter((file) => {
      const match = file.name.match(/Lift (\d+)/);
      return match && match[1] === liftNumber;
    });

    if (filteredFiles.length === 0) {
      throw new Error(`No exact "Lift ${liftName}" subfolder found.`);
    }

    return filteredFiles[0];
  }

  async getHtmlFile(liftFolderId: string, accessToken: string): Promise<drive_v3.Schema$File> {
    const drive = await this.initializeDrive(accessToken);

    const htmlFileQuery = `'${liftFolderId}' in parents and mimeType = 'text/html'`;

    const fileRes = await drive.files.list({
      q: htmlFileQuery,
      includeItemsFromAllDrives: true,
      supportsAllDrives: true,
    });

    if (fileRes.data.files.length === 0) {
      throw new Error("No HTML file found in the specified subfolder.");
    }

    return fileRes.data.files.find((file) => !file.name.toLowerCase().includes('mjml'));
  }

  async getFileContent(fileId: string, accessToken: string): Promise<string> {
    const drive = await this.initializeDrive(accessToken);

    const fileContentRes = await drive.files.get({
      fileId,
      alt: 'media',
    });

    return fileContentRes.data as string;
  }
}
