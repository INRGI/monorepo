import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { OpenToSellDto } from '../dtos/OpenToSell.dto';
import { CloseItemDto } from '../dtos/CloseItem.dto';
import { BuyItemDto } from '../dtos/BuyItem.dto';
import { AuctionItem } from '../entities/auctionItem.entity';
import { Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InventoryService } from '../../loot/services/inventory.service';
import { Item } from '../../loot/entities/item.entity';
import { ItemService } from '../../loot/services/item.service';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';

@Processor('auction')
export class AuctionProcessor extends WorkerHost {
  constructor(
    private readonly heroService: HeroService,
    private readonly inventoryService: InventoryService,
    @Inject('AUCTION_REPOSITORY')
    private readonly auctionItemRepository: Repository<AuctionItem>
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'open': {
        return await this.handleOpenJob(job.data);
      }
      case 'get-opens': {
        return await this.handleGetOpensJob();
      }
      case 'close': {
        return await this.handleCloseJob(job.data);
      }
      case 'buy': {
        return await this.handleBuyJob(job.data);
      }
      case 'get-open-by-id': {
        return await this.handleGetOpenByIdJob(job.data);
      }
    }
  }

  private async handleOpenJob(data: {
    openToSellDto: OpenToSellDto;
  }): Promise<AuctionItem | { error: string }> {
    const { openToSellDto } = data;

    const existing = await this.auctionItemRepository.findOne({
      where: { uniqueItemId: openToSellDto.uniqueItemId, status: 'open' },
    });
    if (existing) return { error: 'Item is already selling' };

    const auctionItem = await this.auctionItemRepository.create(openToSellDto);
    return await this.auctionItemRepository.save(auctionItem);
  }

  private async handleGetOpensJob(): Promise<AuctionItem[]> {
    return await this.auctionItemRepository
      .createQueryBuilder('auctionItem')
      .where('auctionItem.status = :status', { status: 'open' })
      .getMany();
  }

  private async handleCloseJob(data: {
    closeItemDto: CloseItemDto;
  }): Promise<AuctionItem | { error: string }> {
    const { closeItemDto } = data;

    const existing = await this.auctionItemRepository.findOne({
      where: { id: closeItemDto.id, status: 'open' },
    });
    if (!existing) return { error: 'Item not found' };

    await this.auctionItemRepository.update(closeItemDto.id, {
      status: 'cancelled',
    });
    existing.status = 'cancelled';
    return existing;
  }

  private async handleBuyJob(data: {
    buyItemDto: BuyItemDto;
  }): Promise<Item | { error: string }> {
    const { buyItemDto } = data;

    const buyerHeroIdMongo: Types.ObjectId =
      buyItemDto.newOwnerHeroId as unknown as Types.ObjectId;

    const item = await this.inventoryService.findItem(buyItemDto.oldOwnerHeroId, buyItemDto.uniqueId);
    if (!item) return { error: 'Item not found' };

    const existing = await this.auctionItemRepository.findOne({
      where: { id: buyItemDto.id, status: 'open' },
    });
    if (!existing) return { error: 'Item not found' };

    const isSpend = await this.heroService.spendCoins(
      buyerHeroIdMongo,
      buyItemDto.price
    );
    if (!isSpend) return { error: 'Not enough money' };

    const sellResult = await this.inventoryService.sellFromInventory(
      buyItemDto.oldOwnerHeroId,
      buyItemDto.uniqueId,
      buyItemDto.price
    );
    if (!sellResult)
      return { error: 'Something went wrong during the selling' };

    await this.auctionItemRepository
      .createQueryBuilder()
      .delete()
      .from(AuctionItem)
      .where('id = :id', { id: buyItemDto.id })
      .execute();

    await this.inventoryService.addToInventory(buyItemDto.newOwnerHeroId, item);
    return item;
  }

  private async handleGetOpenByIdJob(data: {
    id: number;
  }): Promise<Item | { error: string }> {
    const { id } = data;

    const existing = await this.auctionItemRepository.findOne({
      where: { id: id, status: 'open' },
    });
    
    if (!existing) return { error: 'Item not found' };

    const item = await this.inventoryService.findItem(existing.sellerId, existing.uniqueItemId);
    if (!item) return { error: 'Item not found' };

    return item;
  }
}
