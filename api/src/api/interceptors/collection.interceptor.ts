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
export class CollectionInterceptor implements NestInterceptor {
  private readonly logger = new Logger(CollectionInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    return next.handle().pipe(
      map((data) => {
        if (data instanceof Collection) {
          const page = request.query.page ? Number(request.query.page) : 1;
          const limit = request.query.limit ? Number(request.query.limit) : 30;
          const firstIndex = (page - 1) * limit;
          let lastIndex = firstIndex + limit;

          if (lastIndex > data.totalItems) {
            lastIndex = data.totalItems;
          }

          response.setHeader(
            'Content-Range',
            `bytes ${firstIndex}-${lastIndex}/${data.totalItems}`,
          );
        }

        return data;
      }),
    );
  }
}
