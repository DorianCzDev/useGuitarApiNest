import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const frontEnd =
    process.env.FRONTEND_URL || 'https://use-guitar-panel-nest.vercel.app';

  app.setGlobalPrefix('api');
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: frontEnd,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
