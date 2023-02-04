import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(morgan('combined'));
  await app.listen(5003);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
