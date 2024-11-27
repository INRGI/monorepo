import { HttpException } from '@nestjs/common';

export class ShopException extends HttpException {
    constructor (message: string, statusCode: number = 400) {
        super(message, statusCode);
    }
}