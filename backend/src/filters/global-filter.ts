import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const path = httpAdapter.getRequestUrl(ctx.getRequest());

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let messages: string[] = ['Internal server error'];

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        messages = [response];
      } else if (
        typeof response === 'object' &&
        response !== null &&
        'message' in response
      ) {
        const msg = (response as { message: string | string[] }).message;
        messages = Array.isArray(msg) ? msg : [msg];
      }

      this.logger.warn(`[${httpStatus}] ${path} - ${messages.join(', ')}`);
    } else {

      this.logger.error(`[500] ${path} - GLOBAL EXCEPTION:`, exception);
    }

    const responseBody = {
      statusCode: httpStatus,
      messages,
      timestamp: new Date().toISOString(),
      path: path,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}