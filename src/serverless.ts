import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Callback, Context, Handler } from 'aws-lambda';
import { configure as serverlessExpress } from '@vendia/serverless-express';

import {
  UncaughtExceptionFilter,
  HttpExceptionFilter,
  TypeORMExceptionFilter,
} from './shared/filters';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
