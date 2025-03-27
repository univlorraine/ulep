/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

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
