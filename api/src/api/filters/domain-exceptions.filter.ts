import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { DomainError, DomainErrorCode } from 'src/core/errors';

export const domainErrorToHttpStatusCode: Record<DomainErrorCode, HttpStatus> =
  {
    [DomainErrorCode.RESSOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.RESSOURCE_ALREADY_EXIST]: HttpStatus.BAD_REQUEST,
    [DomainErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
    [DomainErrorCode.UNAUTHORIZED]: HttpStatus.UNAUTHORIZED,
  };

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  private readonly logger = new Logger();

  // This filter catches unhandled domain exceptions and returns a predefined
  // well-formatted JSON response with a human-readable error and a semantically
  // correct HTTP status code that can be handled programmatically by the client.
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatusCode = domainErrorToHttpStatusCode[exception.code];

    response.status(httpStatusCode).json({
      statusCode: httpStatusCode,
      message: exception.message,
      code: exception.code,
    });
  }
}
