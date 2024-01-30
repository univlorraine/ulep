import * as Sentry from '@sentry/node';
import { ArgumentsHost, ConsoleLogger, LogLevel } from '@nestjs/common';

export class SentryService extends ConsoleLogger {
  constructor() {
    super();
    this.init();
  }

  static captureException(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const user = request?.user;

    Sentry.captureException(exception, (scope) => {
      scope.setUser(user);
      scope.setExtra('request.method', request.method);
      scope.setExtra('request.url', request.url);
      scope.setExtra('request.body', request.body);
      scope.setExtra('response.statusCode', response.statusCode);
      scope.setExtra('response.message', response.statusMessage);

      return scope;
    });
  }

  private init(): void {
    if (process.env.NODE_ENV !== 'test' && process.env.SENTRY_DSN) {
      Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 1.0 });
    }
  }

  log(message: string, context?: string) {
    if (!this.shouldLog('log')) {
      return;
    }
    super.log(message, context);
    Sentry.captureMessage(message, 'log');
  }

  error(message: string, trace?: string, context?: string) {
    if (!this.shouldLog('error')) {
      return;
    }
    super.error(message, trace, context);
    Sentry.captureMessage(message, 'error');
  }

  warn(message: string, context?: string) {
    if (!this.shouldLog('warn')) {
      return;
    }
    super.warn(message, context);
    Sentry.captureMessage(message, 'warning');
  }

  debug(message: string, context?: string) {
    if (!this.shouldLog('debug')) {
      return;
    }
    super.debug(message, context);
    Sentry.captureMessage(message, 'debug');
  }

  verbose(message: string, context?: string) {
    if (!this.shouldLog('verbose')) {
      return;
    }
    super.verbose(message, context);
    Sentry.captureMessage(message, 'info');
  }

  private shouldLog(level: LogLevel): boolean {
    let env = 'warn';
    const levels = ['error', 'warn', 'log', 'debug', 'verbose'];

    if (levels.includes(process.env.LOG_LEVEL)) {
      env = process.env.LOG_LEVEL;
    }

    const envIndex = levels.indexOf(env);
    const levelIndex = levels.indexOf(level);

    if (envIndex === -1 || levelIndex === -1) {
      throw new Error(`Unknown log level: ${level}`);
    }

    return levelIndex <= envIndex;
  }
}
