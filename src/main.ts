import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 앱 전체에 해당되는 파이프를 넣어준다(240707)
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(3000);
}
bootstrap();
