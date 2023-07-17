import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { DomainError, DomainErrorCode } from 'src/core/errors/errors';
import { Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

export const domainErrorToHttpStatusCode: Record<DomainErrorCode, HttpStatus> =
  {
    [DomainErrorCode.RESSOURCE_NOT_FOUND]: HttpStatus.NOT_FOUND,
    [DomainErrorCode.RESSOURCE_ALREADY_EXIST]: HttpStatus.BAD_REQUEST,
    [DomainErrorCode.BAD_REQUEST]: HttpStatus.BAD_REQUEST,
  };

@Catch(DomainError)
export class DomainErrorFilter extends BaseExceptionFilter {
  // This filter catches unhandled domain exceptions and returns a predefined
  // well-formatted JSON response with a human-readable error and a semantically
  // correct HTTP status code that can be handled programmatically by the client.
  catch(exception: DomainError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const httpStatusCode = domainErrorToHttpStatusCode[exception.code];

    response.status(httpStatusCode).end(
      JSON.stringify({
        message: exception.message,
      }),
    );
  }
}
