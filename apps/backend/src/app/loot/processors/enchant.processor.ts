import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject } from '@nestjs/common';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Enchant } from '../entities/enchant.entity';

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
        const { item } = job.data;
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
      case 'create-enchant': {
        const { createEnchantDto } = job.data;
        const enchant = this.enchantRepository.create(createEnchantDto);
        return await this.enchantRepository.save(enchant);
      }
      case 'update-enchant': {
        const { id, updateEnchantDto } = job.data;
        await this.enchantRepository.update(id, updateEnchantDto);
        return await this.enchantRepository.findOne({ where: { id } });
      }
      case 'delete-enchant': {
        const { id } = job.data;
        await this.enchantRepository.delete(id);
        return 'Enchant deleted successfully';
      }
      case 'get-enchant': {
        const { id } = job.data;
        return await this.enchantRepository.findOne({ where: { id } });
      }
      case 'find-all-enchants': {
        return await this.enchantRepository.find();
      }
    }
  }
}
