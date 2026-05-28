import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,

      forbidNonWhitelisted: true,

      transform: true,
    })
  )

  // Adds cors
  app.enableCors({

    origin: 'http://localhost:3000',

    credentials: true,
  });
  
  // Adds secure HTTP headers
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
