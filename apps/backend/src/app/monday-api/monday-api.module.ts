import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MondayApiService } from "./monday-api.service";
import { MondayApiController } from "./monday-api.controller";

@Module({
    controllers:[MondayApiController],
    providers: [MondayApiService],
    imports: [ConfigModule]
})
export class MondayApiModule{}