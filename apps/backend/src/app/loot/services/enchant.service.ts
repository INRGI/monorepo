import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Enchant } from '../entities/enchant.entity';
import { Item } from '../entities/item.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';

@Injectable()
export class EnchantService {
  constructor(
    @Inject('ENCHANT_REPOSITORY')
    private enchantRepository: Repository<Enchant>,
  ) {}

  async applyEnchantment(item: Item): Promise<Item> {
    const enchantments = await this.enchantRepository
      .createQueryBuilder('enchant')
      .where('enchant.typeFor = :typeFor', { typeFor: item.type })
      .getMany();

    if (enchantments.length) {
      const randomEnchant = enchantments[Math.floor(Math.random() * enchantments.length)];
      item.enchanted = randomEnchant.name;
      item.stats.attack = Math.floor(item.stats.attack * (1 + randomEnchant.chances / 100));
    }

    return item;
  }

  async createEnchant(createEnchantDto: CreateEnchantDto): Promise<Enchant> {
    const enchant = this.enchantRepository.create(createEnchantDto);
    return await this.enchantRepository.save(enchant);
  }

  async updateEnchant(id: number, updateEnchantDto: UpdateEnchantDto): Promise<Enchant> {
    await this.enchantRepository.update(id, updateEnchantDto);
    return await this.enchantRepository.findOne({ where: { id } });
  }

  async deleteEnchant(id: number): Promise<string> {
    await this.enchantRepository.delete(id);
    return 'Enchant deleted successfully';
  }

  async getEnchantById(id: number): Promise<Enchant> {
    return await this.enchantRepository.findOne({ where: { id } });
  }

  async findAllEnchants(): Promise<Enchant[]> {
    return await this.enchantRepository.find();
  }
}
