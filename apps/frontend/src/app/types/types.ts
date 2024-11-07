import { User } from '@org/users';
export interface Equip {
  id: string;
  weapon: Item;
  armor: Item;
}

export type PvpRoom = {
  id: string;
  creatorHeroId: string;
  oponentHeroId?: string;
  heroName: string;
  betAmount: number;
};

export type ChooseTypeDto = {
  heroId: string;
  roomId: string;
  chosenType: 'SHIELD' | 'ATTACK' | 'DODGE';
};

export interface HOL {
  guessChoosed?: 'higher' | 'lower';
  prevNumber?: number;
  guessedTimes?: number;
  betAmount: number;
  heroId: string;
}

export interface HolResult {
  rewardCoins: number;
  guessChoosed?: 'higher' | 'lower';
  prevNumber: number;
  ifLoose: boolean;
  heroId: string;
}

export interface Card {
  id: number;
  rewardCoins: number;
}

export interface GuildBoss {
  id: number;
  name: string;
  health: number;
  attack: number;
  image: string;
  rewardCoins: number;
}

export interface HeroQuest {
  id: string;
  heroId: string;
  isCompleted: boolean;
  quest: {
    name: string;
    description: string;
    id: number;
    taskType: string;
    targetAmount: number;
    rewardCoins: number;
  };
}

export interface HeroSkill {
  id: string;
  heroId: string;
  level: number;
  cooldownTurnsLeft?: number;
  skill: {
    id: number;
    name: string;
    description: string;
    skillType: string;
    damage?: number;
    healing?: number;
    cooldown: number;
  };
}

export interface Character {
  _id: string;
  name: string;
  level: number;
  health: number;
  hp: number;
  attack: number;
  imageUrl: string;
  experience: number;
  coins: number;
  user: User | null;
}

export interface Monster {
  id: number;
  name: string;
  health: number;
  attack: number;
  imageUrl: string;
  xp: number;
}

export interface Box {
  id: number;
  name: string;
  image: string;
  cost: number;
}

export interface Item {
  uniqueItemId?: string;
  sellerId?: string;
  price?: number;
  id: number;
  uniqueId: string;
  name: string;
  image: string;
  type: 'weapon' | 'armor';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  enchanted: string;
  stats: {
    attack?: number;
    health?: number;
  };
}

export interface Message {
  roomId: string;
  senderId: string;
  message: string;
}

export interface ChatProps {
  roomId: string;
  senderId: string;
}
