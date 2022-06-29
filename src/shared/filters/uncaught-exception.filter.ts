import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { EntityPropertyNotFoundError } from 'typeorm';
import { parseContext } from '../utils';

@Catch()
export class UncaughtExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    console.log(exception);
    console.log(exception instanceof EntityPropertyNotFoundError);

    const { request, response, contextType } = parseContext(host);
    const statusCode = exception.status || 500;
    const message = exception.message || 'Internal Server Error';
    console.log(statusCode);

    if (contextType === 'http') {
      response.status(statusCode).json({
        statusCode,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      return exception;
    }
  }
}
