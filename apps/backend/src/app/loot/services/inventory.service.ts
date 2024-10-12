import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Inventory } from '../entities/inventory.entity';
import { Item } from '../entities/item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @Inject('INVENTORY_REPOSITORY')
    private inventoryRepository: Repository<Inventory>
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

  async deleteFromInventory(heroId: string, itemId: number) {
    const inventory = await this.getInventory(heroId);
    const updatedInventory = inventory.inventory.filter(
      (item) => item.id !== itemId
    );

    await this.inventoryRepository.update(
      { heroId },
      { inventory: updatedInventory }
    );

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
}
