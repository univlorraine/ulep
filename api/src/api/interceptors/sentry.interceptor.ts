import { SentryService } from '@app/common';
import { KeycloakException } from '@app/keycloak';
import {
  CallHandler,
  Catch,
  ExecutionContext,
  ForbiddenException,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { DomainError, DomainErrorCode } from 'src/core/errors';

@Catch()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (this.shouldHandleError(err)) {
          SentryService.captureException(err, context);
        }
        throw err;
      }),
    );
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
