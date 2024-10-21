import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Enchant } from '../entities/enchant.entity';
import { Item } from '../entities/item.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';

@Processor('enchant')
export class EnchantProcessor extends WorkerHost {
  constructor(
    @Inject('ENCHANT_REPOSITORY')
    private enchantRepository: Repository<Enchant>
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
    }
  }

  private async handleApplyEnchantmentJob(data: { item: Item }) {
    const { item } = data;
    const enchantments = await this.enchantRepository
      .createQueryBuilder('enchant')
      .where('enchant.typeFor = :typeFor', { typeFor: item.type })
      .getMany();

    if (enchantments.length) {
      const randomEnchant =
        enchantments[Math.floor(Math.random() * enchantments.length)];
      item.enchanted = randomEnchant.name;
      item.stats.attack = Math.floor(
        item.stats.attack * (1 + randomEnchant.chances / 100)
      );
    }

    return item;
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
