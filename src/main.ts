import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Chỉ giữ lại các field có trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
