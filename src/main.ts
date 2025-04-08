import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Enable CORS
  // Enable CORS with specific origin
  // app.enableCors({
  // origin: '*',
  //   origin: 'https://organic-acorn-gxp46vp7grxh6rp-3000.app.github.dev',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  // Add global error handler
  app.use((err, req, res, next) => {
    Logger.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
