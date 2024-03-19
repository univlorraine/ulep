import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

export const I18N_SERVICE_CONFIGURATION = 'I18N_SERVICE_CONFIGURATION';

export interface I18nServiceConfiguration {
  // TODO
  fallbackLanguage?: string;
}

export type I18nTranslation =
  | string
  | {
      [key: string]: I18nTranslation | string;
    };

@Injectable()
export class I18nService implements OnModuleInit, OnModuleDestroy {
  #logger: Logger;

  constructor(
    @Inject(I18N_SERVICE_CONFIGURATION)
    private readonly config: I18nServiceConfiguration,
  ) {
    // @Inject(MAILER_CONFIGURATION) private readonly config: MailerConfiguration,
    this.#logger = new Logger('I18nService');
  }

  onModuleInit() {
    // TODO
  }

  onModuleDestroy() {
    // TODO
  }

  public translate(key: string, options?: any): I18nTranslation {
    this.#logger.debug('option', options);
    return key;
  }
}
