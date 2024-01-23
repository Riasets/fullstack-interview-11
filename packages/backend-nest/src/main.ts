import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/AppModule';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  {
    const config: ConfigService = app.get(ConfigService);

    const hostname = config.get('BACKEND_HOST') || 'localhost';
    const port = +config.get('BACKEND_PORT') || 8000;
    await app.listen(port, hostname);
  }
}

bootstrap();
