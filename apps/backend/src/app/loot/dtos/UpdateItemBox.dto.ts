
export class UpdateItemBoxDto{
    id: number;
    name?: string;
    cost?: number;
    image?: string;
    chances?: {
        common?: number;
        rare?: number;
        epic?: number;
        legendary?: number;
    };
}