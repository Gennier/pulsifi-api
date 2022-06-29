import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import {
  EntityNotFoundError,
  EntityPropertyNotFoundError,
  QueryFailedError,
} from 'typeorm';
import { parseContext } from '../utils';

@Catch(EntityNotFoundError, EntityPropertyNotFoundError, QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const { request, response, contextType } = parseContext(host);
    const statusCode = exception.status || 400;
    const message =
      exception.message || 'Something went wrong. Please contact admin';

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
