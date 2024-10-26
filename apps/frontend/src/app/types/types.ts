import { User } from '@org/users';

export interface HeroQuest {
  id: string;
  name: string;
  description: string;
  heroId: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  reward: string;
}

export interface Character {
  _id: string;
  name: string;
  level: number;
  health: number;
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
