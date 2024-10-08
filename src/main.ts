import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: process.env.FRONTEND_URL || [
      'https://use-guitar-panel-nest.vercel.app',
      'https://use-guitar-nest.vercel.app',
    ],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
