import { User } from "@org/users";

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
  id: number;
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