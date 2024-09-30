import { User } from "@org/users";

export interface Character {
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
}
