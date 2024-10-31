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

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
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
        ],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
