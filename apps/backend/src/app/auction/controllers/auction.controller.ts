import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { AuctionService } from "../services/auction.service";
import { OpenToSellDto } from "../dtos/OpenToSell.dto";
import { CloseItemDto } from "../dtos/CloseItem.dto";
import { BuyItemDto } from "../dtos/BuyItem.dto";

@Controller('auction')
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
    async getOneById(@Param('id') id:number){
        return await this.auctionService.getOpenById(id);
    }

    @Delete()
    async closeSelling(@Body() data: CloseItemDto){
        return await this.auctionService.closeSellingItem(data);
    }

    @Post('buy')
    async buyItem(@Body() data: BuyItemDto){
        return await this.auctionService.buyItem(data);
    }
}