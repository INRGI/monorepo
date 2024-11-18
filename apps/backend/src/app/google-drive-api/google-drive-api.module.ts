import { Module } from "@nestjs/common";
import { GoogleDriveService } from "./google-drive-api.service";
import { GoogleDriveController } from "./google-drive-api.controller";

@Module({
    providers: [GoogleDriveService],
    controllers: [GoogleDriveController]
})
export class GoogleDriveModule{}