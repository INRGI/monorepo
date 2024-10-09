
export class UpdateItemBoxDto{
    id: number;
    name?: string;
    cost?: number;
    chances?: {
        common?: number;
        rare?: number;
        epic?: number;
        legendary?: number;
    };
}