import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Observable, catchError } from 'rxjs';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const transaction = Sentry.startTransaction({
      op: 'http.server',
      name: `${req.method} ${req.url}`,
    });

    Sentry.getCurrentHub().configureScope(scope => {
      scope.setSpan(transaction);
      scope.setContext('request', {
        method: req.method,
        url: req.url,
        headers: req.headers,
      });
    });

    return next.handle().pipe(
      catchError((err) => {
        Sentry.captureException(err, {
          extra: {
            url: req.url,
            method: req.method,
            body: req.body,
            query: req.query,
            user: req.user,
          },
        });
        transaction.finish();
        throw err;
      })
    );
  }
}