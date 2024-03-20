// import i18next from 'i18next';
// Inspire commit 5c06febdcfb91e891224e37406cc43d3975f9441

import * as i18n from 'i18next';
import * as HttpBackend from 'i18next-http-backend';
// import * as ChainedBackend from 'i18next-chained-backend';
// import * as resourcesToBackend from 'i18next-resources-to-backend';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

export const I18N_SERVICE_CONFIGURATION = 'I18N_SERVICE_CONFIGURATION';

export interface I18nServiceConfiguration {
  fallbackLanguage?: string;
  http: {
    endpoint: string;
    endpointSuffix?: string;
    token?: string;
    bearerToken?: string;
  };
}

export type I18nTranslation =
  | string
  | {
      [key: string]: I18nTranslation | string;
    };

@Injectable()
export class I18nService implements OnModuleInit, OnModuleDestroy {
  #logger: Logger;
  #i18n: any;

  constructor(
    @Inject(I18N_SERVICE_CONFIGURATION)
    private readonly config: I18nServiceConfiguration,
  ) {
    this.#logger = new Logger('I18nService');
  }

  async onModuleInit() {
    // Idea: browser repo to get available languages (how to manage that on reload though)
    // Idea: use of gitlab/github webhooks
    // Idea: i18next.loadLanguages(['de', 'fr'])

    const { languages, components } =
      await this.getAvailableLanguagesAndComponents();
    console.log('test', [...languages]);

    const url = `https://weblate.ulep.thestaging.io/api/translations/ulep/{{ns}}/{{lng}}/file/`;

    // i18n.use(ChainedBackend as any).init<ChainedBackend.ChainedBackendOptions>(
    this.#i18n = i18n.use(HttpBackend as any);

    await this.#i18n.init({
      lng: [...languages],
      fallbackLng: this.config.fallbackLanguage || 'en',
      ns: [...components],
      debug: true, // TODO(NOW+1)
      // debug: getLoggerLevels(config.logLevel).includes('debug'),
      backend: {
        loadPath: url,
        crossDomain: true,

        withCredentials: true,
        customHeaders: () => {
          return {
            Authorization: `Token ${this.config.http.token}`,
          };
        },
        reloadInterval: 60 * 60 * 1000, // Reload each hour
      },
    });
  }

  onModuleDestroy() {
    // TODO
  }

  private async getAvailableLanguagesAndComponents(): Promise<{
    languages: string[];
    components: string[];
  }> {
    const translationsUrl =
      'https://weblate.ulep.thestaging.io/api/translations/';

    const res = await fetch(translationsUrl, {
      headers: {
        Authorization: `Bearer ${this.config.http.token}`,
      },
    });
    if (!res.ok) {
      try {
        const data = await res.json();
        this.#logger.error(data);
      } catch (err) {
        this.#logger.error(res.body);
      }
      // TODO(NOW): see how manage that
    } else {
      const data = await res.json();
      return data.results.reduce(
        (acc, value) => {
          const code = value.language_code;
          const component = value.component.slug;

          // Glossary is a component created by Weblate
          if (component !== 'glossary') {
            if (acc.languages.has(code) <= 0) {
              acc.languages.add(code);
            }
            if (acc.components.has(component) <= 0) {
              acc.components.add(component);
            }
          }

          return acc;
        },
        {
          components: new Set(),
          languages: new Set(),
        },
      );
    }
  }

  public translate(key: string, opts: any) {
    console.log('opts', opts);
    return this.#i18n.t(key, opts);
  }
}
