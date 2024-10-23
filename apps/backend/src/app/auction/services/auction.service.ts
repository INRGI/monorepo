import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';
import { OpenToSellDto } from '../dtos/OpenToSell.dto';
import { CloseItemDto } from '../dtos/CloseItem.dto';
import { BuyItemDto } from '../dtos/BuyItem.dto';

@Injectable()
export class AuctionService {
  private queueEvents: QueueEvents;

  constructor(@InjectQueue('auction') private readonly auctionQueue: Queue) {
    this.queueEvents = new QueueEvents('auction');
  }

  async openToSellItem(openToSellDto: OpenToSellDto) {
    const job = await this.auctionQueue.add('open', {openToSellDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getOpens() {
    const job = await this.auctionQueue.add('get-opens', {});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async getOpenById(id: number){
    const job = await this.auctionQueue.add('get-open-by-id', {id});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async closeSellingItem(closeItemDto: CloseItemDto) {
    const job = await this.auctionQueue.add('close', {closeItemDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }

  async buyItem(buyItemDto: BuyItemDto) {
    const job = await this.auctionQueue.add('buy', {buyItemDto});
    const result = await job.waitUntilFinished(this.queueEvents);
    return result;
  }
}
