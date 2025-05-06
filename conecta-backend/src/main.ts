import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  app.enableCors();
  
  const configService = app.get(ConfigService);
  
  // Add validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));
  
  // Configurar pasta de uploads como estática
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });
  
  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  
  // Log the OAuth callback URL
  console.log(`Google OAuth callback URL: ${configService.get('GOOGLE_CALLBACK_URL')}`);
}
bootstrap();
