import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  HttpExceptionFilter,
  TypeORMExceptionFilter,
  UncaughtExceptionFilter,
} from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT;
  const apiBasePath = process.env.API_BASE_PATH;

  if (apiBasePath) {
    app.setGlobalPrefix(apiBasePath);
  }
  app.useGlobalFilters(
    new UncaughtExceptionFilter(),
    new HttpExceptionFilter(),
    new TypeORMExceptionFilter(),
  );
  app.enableCors();

  await app.listen(port);

  Logger.log(
    `Application is running on: http://localhost:${port}${apiBasePath}`,
  );
}
bootstrap();
