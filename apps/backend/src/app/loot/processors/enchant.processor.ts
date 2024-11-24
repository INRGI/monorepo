import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Enchant } from '../entities/enchant.entity';
import { Item } from '../entities/item.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';
import { HeroService } from '@org/users';
import { ReenchantDto } from '../dtos/Reenchant.dto';
import { Types } from 'mongoose';
import { Inventory } from '../entities/inventory.entity';
import { InventoryService } from '../services/inventory.service';

@Processor('enchant')
export class EnchantProcessor extends WorkerHost {
  constructor(
    @Inject('ENCHANT_REPOSITORY')
    private enchantRepository: Repository<Enchant>,
    private readonly heroService: HeroService,
    private readonly inventoryService: InventoryService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'apply-enchantment': {
        return await this.handleApplyEnchantmentJob(job.data);
      }
      case 'create-enchant': {
        return await this.hanndleCreateEnchantJob(job.data);
      }
      case 'update-enchant': {
        return await this.handleUpdateEnchantJob(job.data);
      }
      case 'delete-enchant': {
        return await this.handleDeleteEnchantJob(job.data);
      }
      case 'get-enchant': {
        return await this.handleGetEnchantJob(job.data);
      }
      case 'find-all-enchants': {
        return await this.enchantRepository.find();
      }
      case 'reenchant': {
        return await this.handleReenchantJob(job.data);
      }
    }
  }

  /**
   * Applies an enchantment to the given item. If the item is already enchanted,
   * it first removes the previous enchantment. Then, it randomly selects one of
   * the enchantments in the database that is applicable to the item's type and
   * applies it to the item. The enchantment increases the item's attack or health
   * stat by the percentage amount specified in the enchantment.
   * @param data The job data containing the item to enchant.
   * @returns The modified item.
   */
  private async handleApplyEnchantmentJob(data: { item: Item }) {
    const { item } = data;
    const enchantments = await this.enchantRepository
      .createQueryBuilder('enchant')
      .where('enchant.typeFor = :typeFor', { typeFor: item.type })
      .getMany();

    if (item.type === 'weapon') {
      if (item.enchanted) {
        const previousEnchant = await this.enchantRepository.findOne({
          where: { name: item.enchanted },
        });
        if (previousEnchant) {
          item.stats.attack = Math.floor(
            item.stats.attack / (1 + previousEnchant.percentageIncrease / 100)
          );
        }

        item.enchanted = null;
      }

      if (enchantments.length) {
        const randomEnchant =
          enchantments[Math.floor(Math.random() * enchantments.length)];
        item.enchanted = randomEnchant.name;
        item.stats.attack = Math.floor(
          item.stats.attack * (1 + randomEnchant.percentageIncrease / 100)
        );
      }

      return item;
    }

    if (item.type === 'armor') {
      if (item.enchanted) {
        const previousEnchant = await this.enchantRepository.findOne({
          where: { name: item.enchanted },
        });
        if (previousEnchant) {
          item.stats.health = Math.floor(
            item.stats.health / (1 + previousEnchant.percentageIncrease / 100)
          );
        }

        item.enchanted = null;
      }

      if (enchantments.length) {
        const randomEnchant =
          enchantments[Math.floor(Math.random() * enchantments.length)];
        item.enchanted = randomEnchant.name;
        item.stats.health = Math.floor(
          item.stats.health * (1 + randomEnchant.percentageIncrease / 100)
        );
      }

      return item;
    }
  }

  /**
   * Applies a random enchantment to an item in the inventory.
   * @param data - The heroId, price, and item to enchant.
   * @returns The enchanted item.
   */
  private async handleReenchantJob(data: ReenchantDto) {
    const { heroId, price, item } = data;
    await this.heroService.spendCoins(
      heroId as unknown as Types.ObjectId,
      price
    );

    const result = await this.handleApplyEnchantmentJob({ item: item });
    await this.inventoryService.updateItem(heroId, result);

    return result;
  }

  /**
   * Handles the 'create-enchant' job.
   *
   * Creates a new enchantment in the database.
   *
   * @param data The data to create the enchantment with.
   *
   * @returns A promise that resolves to the newly created `Enchant` object.
   */
  private async hanndleCreateEnchantJob(data: {
    createEnchantDto: CreateEnchantDto;
  }): Promise<any> {
    const { createEnchantDto } = data;
    const enchant = this.enchantRepository.create(createEnchantDto);
    return await this.enchantRepository.save(enchant);
  }

  /**
   * Handles the 'update-enchant' job.
   *
   * Updates an enchantment by its ID.
   *
   * @param data The data to update the enchantment with.
   *
   * @returns A promise that resolves to the updated `Enchant` object.
   */
  private async handleUpdateEnchantJob(data: {
    id: number;
    updateEnchantDto: UpdateEnchantDto;
  }): Promise<any> {
    const { id, updateEnchantDto } = data;
    await this.enchantRepository.update(id, updateEnchantDto);
    return await this.enchantRepository.findOne({ where: { id } });
  }

/**
 * Deletes an enchantment by its ID.
 * @param data An object containing the ID of the enchantment to be deleted.
 * @returns A promise that resolves to a string indicating successful deletion.
 */
  private async handleDeleteEnchantJob(data: { id: number }): Promise<any> {
    const { id } = data;
    await this.enchantRepository.delete(id);
    return 'Enchant deleted successfully';
  }

  /**
   * Gets an enchantment by its ID.
   * @param data The object containing the ID of the enchantment to get.
   * @returns A promise that resolves to the `Enchant` object with the given ID.
   */
  private async handleGetEnchantJob(data: { id: number }): Promise<any> {
    const { id } = data;
    return await this.enchantRepository.findOne({ where: { id } });
  }
}
