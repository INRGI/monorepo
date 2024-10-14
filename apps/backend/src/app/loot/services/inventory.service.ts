import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Item } from '../entities/item.entity';
import { HeroService } from '@org/users';
import { Types } from 'mongoose';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: Repository<Inventory>,
    private readonly heroService: HeroService
  ) {}

  async getInventory(heroId: string): Promise<Inventory> {
    let inventory = await this.inventoryRepository.findOne({
      where: { heroId },
    });
    if (!inventory) {
      inventory = this.inventoryRepository.create({ heroId, inventory: [] });
    }

    return await this.inventoryRepository.save(inventory);
  }

  async addToInventory(heroId: string, item: Item): Promise<Inventory> {
    let inventory = await this.getInventory(heroId);

    inventory.inventory.push(item);
    return await this.inventoryRepository.save(inventory);
  }

  async sellFromInventory(heroId: string, uniquId: string) {
    const inventory = await this.getInventory(heroId);
    const updatedInventory = inventory.inventory.filter(
      (item) => item.uniqueId !== uniquId
    );
    const heroIdMongo: Types.ObjectId = heroId as unknown as Types.ObjectId;
    const itemToSell = inventory.inventory.find(
      (item) => item.uniqueId === uniquId
    );
    await this.inventoryRepository.update(
      { heroId },
      { inventory: updatedInventory }
    );
    await this.heroService.earnCoins(heroIdMongo, this.getValueOfItem(itemToSell.rarity));
    return updatedInventory;
  }

  async getByRarity(
    heroId: string,
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): Promise<Item[]> {
    const inventory = await this.getInventory(heroId);

    const filteredItems =
      inventory.inventory?.filter((item: Item) => item.rarity === rarity) || [];

    return filteredItems;
  }

  private getValueOfItem(
    rarity: 'common' | 'rare' | 'epic' | 'legendary'
  ): number {
    if (rarity === 'common') return 5;
    if (rarity === 'rare') return 20;
    if (rarity === 'epic') return 100;
    return 400;
  }
}
