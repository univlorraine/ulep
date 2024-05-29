import * as i18n from 'i18next';
import * as HttpBackend from 'i18next-http-backend';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

export const I18N_SERVICE_CONFIGURATION = 'I18N_SERVICE_CONFIGURATION';

const DEFAULT_RELOAD_INTERVAL = 24 * 60 * 60 * 1000;

const LANGUAGES = ['en', 'fr', 'zh', 'de', 'es'];
const NAMESPACES = ['emails', 'translation', 'api', 'notifications'];

export interface I18nServiceConfiguration {
  fallbackLanguage?: string;
  debug?: boolean;
  http: {
    url: string;
    token?: string;
    reloadInterval?: number;
  };
}

export type I18nTranslation =
  | string
  | {
      [key: string]: I18nTranslation | string;
    };

@Injectable()
export class I18nService implements OnModuleInit {
  #logger: Logger;
  #i18n: i18n.i18n;

  constructor(
    @Inject(I18N_SERVICE_CONFIGURATION)
    private readonly config: I18nServiceConfiguration,
  ) {
    this.#logger = new Logger('I18nService');
    this.#logger.debug(`Config: ${JSON.stringify(this.config)}`);
  }

  async onModuleInit() {
    const url = `${this.config.http.url}/{{lng}}/{{ns}}.json`;

    this.#i18n = i18n.use(HttpBackend as unknown as i18n.Module);

    console.log({ url });
    await this.#i18n.init({
      fallbackLng: this.config.fallbackLanguage || 'en',
      ns: NAMESPACES,
      debug: true, //this.config.debug,
      preload: LANGUAGES,
      backend: {
        loadPath: url,
        crossDomain: true,
        reloadInterval:
          this.config.http.reloadInterval || DEFAULT_RELOAD_INTERVAL,
      },
    });
  }

  public translate(key: string, opts: any) {
    return this.#i18n.t(key, opts);
  }

  public hasLanguageBundle(language: string, namespace: string) {
    return this.#i18n.hasResourceBundle(language, namespace);
  }

  public getLanguageBundle(language: string, namespace: string) {
    return this.#i18n.getResourceBundle(language, namespace);
  }
}
