import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/app.module';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  
  config();
  const configService = app.get(ConfigService);
  const host = configService.get<string>('HOST') ?? 'localhost';
  const port = configService.get<number>('PORT') ?? 3000;
  
  app.enableCors();
  
  await app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}

bootstrap();
