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

  private async handleApplyEnchantmentJob(data: { item: Item }) {
    const { item } = data;
    const enchantments = await this.enchantRepository
      .createQueryBuilder('enchant')
      .where('enchant.typeFor = :typeFor', { typeFor: item.type })
      .getMany();

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

  private async handleReenchantJob(data: ReenchantDto) {
    const { heroId, price, item } = data;
    await this.heroService.spendCoins(
      heroId as unknown as Types.ObjectId,
      price
    );

    const result = await this.handleApplyEnchantmentJob({item: item});
    await this.inventoryService.updateItem(heroId, result);
    
    return result;
  }

  private async hanndleCreateEnchantJob(data: {
    createEnchantDto: CreateEnchantDto;
  }): Promise<any> {
    const { createEnchantDto } = data;
    const enchant = this.enchantRepository.create(createEnchantDto);
    return await this.enchantRepository.save(enchant);
  }

  private async handleUpdateEnchantJob(data: {
    id: number;
    updateEnchantDto: UpdateEnchantDto;
  }): Promise<any> {
    const { id, updateEnchantDto } = data;
    await this.enchantRepository.update(id, updateEnchantDto);
    return await this.enchantRepository.findOne({ where: { id } });
  }

  private async handleDeleteEnchantJob(data: { id: number }): Promise<any> {
    const { id } = data;
    await this.enchantRepository.delete(id);
    return 'Enchant deleted successfully';
  }

  private async handleGetEnchantJob(data: { id: number }): Promise<any> {
    const { id } = data;
    return await this.enchantRepository.findOne({ where: { id } });
  }
}
