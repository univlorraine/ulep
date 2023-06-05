import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

type ErrorCodes = {
  [key: string]: number;
};

/*
 * This filter is used to catch Prisma exceptions.
 * Full list of error codes: https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);

  private errorCodesStatusMapping: ErrorCodes = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    this.logger.error(exception.message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = this.exceptionShortMessage(exception.message);

    response.status(statusCode).json({ message: message });
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
