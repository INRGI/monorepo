import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Enchant } from '../entities/enchant.entity';
import { Item } from '../entities/item.entity';
import { CreateEnchantDto } from '../dtos/CreateEnchant.dto';
import { UpdateEnchantDto } from '../dtos/UpdateEnchan.dto';
import { Queue, QueueEvents } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class EnchantService {
  private queueEvents: QueueEvents
  constructor(
    @InjectQueue('enchant') private readonly enchantQueue: Queue
  ) {
    this.queueEvents = new QueueEvents('enchant')
  }

  async applyEnchantment(item: Item): Promise<Item> {
   const job = await this.enchantQueue.add('apply-enchantment', {item})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  async createEnchant(createEnchantDto: CreateEnchantDto): Promise<Enchant> {
    const job = await this.enchantQueue.add('create-enchant', {createEnchantDto})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  async updateEnchant(id: number, updateEnchantDto: UpdateEnchantDto): Promise<Enchant> {
    const job = await this.enchantQueue.add('update-enchant', {id, updateEnchantDto})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  async deleteEnchant(id: number): Promise<string> {
    const job = await this.enchantQueue.add('delete-enchant', {id})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  async getEnchantById(id: number): Promise<Enchant> {
    const job = await this.enchantQueue.add('get-enchant', {id})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }

  async findAllEnchants(): Promise<Enchant[]> {
    const job = await this.enchantQueue.add('find-all-enchants', {})
   const result = await job.waitUntilFinished(this.queueEvents);
   return result;
  }
}
