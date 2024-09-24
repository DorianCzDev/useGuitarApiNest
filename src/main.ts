import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: 'https://use-guitar-panel-nest.vercel.app',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
