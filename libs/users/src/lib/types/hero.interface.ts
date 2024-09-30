import { Types } from "mongoose";

export interface Hero{
    _id: Types.ObjectId;
    name: string;
    imageUrl: string;
    level: number;
    attack: number;
    health: number;
    experience: number;
    coins: number;
    user: string;
};