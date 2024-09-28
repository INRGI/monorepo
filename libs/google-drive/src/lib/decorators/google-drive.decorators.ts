import { Inject } from "@nestjs/common";
import { GoogleDriveTokens } from "../google-drive.tokens";


export const InjectGoogleDrive = (): ReturnType<typeof Inject> => Inject(GoogleDriveTokens.GoogleDriveService);