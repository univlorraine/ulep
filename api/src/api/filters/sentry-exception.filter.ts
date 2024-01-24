import { SentryService } from '@app/common';
import { KeycloakException } from '@app/keycloak';
import {
  Catch,
  ArgumentsHost,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DomainError, DomainErrorCode } from 'src/core/errors';

@Catch()
export class SentryFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    if (this.shouldHandleError(exception)) {
      SentryService.captureException(exception, host);
    }

    super.catch(exception, host);
  }

  private shouldHandleError(exception: unknown): boolean {
    if (exception instanceof DomainError) {
      return [
        DomainErrorCode.RESSOURCE_ALREADY_EXIST,
        DomainErrorCode.BAD_REQUEST,
      ].includes(exception.code);
    }

    return ![UnauthorizedException, ForbiddenException, KeycloakException].some(
      (error) => exception instanceof error,
    );
  }
}
