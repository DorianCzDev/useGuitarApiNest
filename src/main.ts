import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// prettier-ignore

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors: true});

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['https://use-guitar-panel-nest.vercel.app','https://use-guitar-nest.vercel.app'],
    allowedHeaders: ['Origin, X-Requested-With, Content-Type, Accept, Authentication, Access-control-allow-credentials, Access-control-allow-headers, Access-control-allow-methods, Access-control-allow-origin, User-Agent, Referer, Accept-Encoding, Accept-Language, Access-Control-Request-Headers, Cache-Control, Pragma'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
