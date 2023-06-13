import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Paginator } from 'src/shared/types/paginator';

@Injectable()
export class CollectionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();
    return next.handle().pipe(
      map((data) => {
        if (data && data instanceof Paginator) {
          response.setHeader(
            'Content-Range',
            `bytes ${data.firstIndex}-${data.lastIndex}/${data.total}`,
          );
          return { items: data.items, total: data.take };
        }

        return data;
      }),
    );
  }
}
