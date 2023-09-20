import { Collection } from '@app/common';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class HttpLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(HttpLoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const { method, originalUrl } = request;

    this.logger.log(
      JSON.stringify({
        method,
        url: originalUrl,
      }),
    );

    return next.handle().pipe(
      map((data) => {
        const response = ctx.getResponse();
        this.logger.debug(
          JSON.stringify({
            method,
            url: originalUrl,
            responseStatus: response.statusCode,
          }),
        );
        return data;
      }),
    );
  }
}
