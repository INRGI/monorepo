import { DataSource } from 'typeorm';
import { Item } from '../loot/entities/item.entity';
import { ItemBox } from '../loot/entities/itemBox.entity';
import { Enchant } from '../loot/entities/enchant.entity';
import { Inventory } from '../loot/entities/inventory.entity';
import { Guild } from '../guild/entities/guild.entity';
import { GuildParticipant } from '../guild/entities/guildParticipant.entity';
import { AuctionItem } from '../auction/entities/auctionItem.entity';
import { Quests } from '../quests/entities/quests.entity';
import { HeroQuest } from '../quests/entities/heroQuest.entity';
import { Equip } from '../loot/entities/equip.entity';
import { HeroSkill } from '../skills/entities/heroSkill.entity';
import { Skills } from '../skills/entities/skills.entity';
import { GuildBoss } from '../guild/entities/guildBoss.entity';
import { Potion } from '../potion/entities/potion.entity';
import { HeroPotion } from '../potion/entities/hero-potion.entity';
import { HeroSetting } from '../settings/entities/heroSetting.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
/**
 * Creates and initializes a new DataSource instance for the application.
 * 
 * This factory function configures a MySQL data source using TypeORM with
 * the specified connection details and entities. The database synchronization
 * feature is enabled for automatic schema updates.
 * 
 * @returns A promise that resolves to the initialized DataSource.
 */
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'mysql',
        host: '127.0.0.1',
        port: 8889,
        username: 'root',
        password: 'root',
        database: 'loot',
        entities: [
          Item,
          ItemBox,
          Enchant,
          Inventory,
          Guild,
          GuildParticipant,
          AuctionItem,
          Quests,
          HeroQuest,
          Equip,
          HeroSkill,
          Skills,
          GuildBoss,
          Potion,
          HeroPotion,
          HeroSetting
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
