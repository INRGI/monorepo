import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { AuctionService } from "../services/auction.service";
import { OpenToSellDto } from "../dtos/OpenToSell.dto";
import { CloseItemDto } from "../dtos/CloseItem.dto";
import { BuyItemDto } from "../dtos/BuyItem.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller('auction')
@UseInterceptors(CacheInterceptor)
export class AuctionController {
    constructor(private readonly auctionService: AuctionService){}

    @Post('open')
    async openToSellItem(@Body() data: OpenToSellDto){
        return await this.auctionService.openToSellItem(data);
    }

    @Get()
    async getAll(){
        return await this.auctionService.getOpens();
    }

    @Get(':id')
    async getOneById(@Param('id', ParseIntPipe) id:number){
        return await this.auctionService.getOpenById(id);
    }

    @Delete()
    async closeSelling(@Body(ValidationPipe) data: CloseItemDto){
        return await this.auctionService.closeSellingItem(data);
    }

    @Post('buy')
    async buyItem(@Body(ValidationPipe) data: BuyItemDto){
        return await this.auctionService.buyItem(data);
    }
}