import { drive_v3 } from 'googleapis';

export interface GoogleDriveServicePort {
  getFiles(): Promise<drive_v3.Schema$File[]>;
  getFile(fileId: string): Promise<drive_v3.Schema$File>;
  getFolderContents(folderId: string): Promise<drive_v3.Schema$File[]>;
  createTestFile(fileName: string, mimeType: string): Promise<string>;
}
