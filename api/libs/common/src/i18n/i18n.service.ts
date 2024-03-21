import * as i18n from 'i18next';
import * as HttpBackend from 'i18next-http-backend';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

export const I18N_SERVICE_CONFIGURATION = 'I18N_SERVICE_CONFIGURATION';

const DEFAULT_RELOAD_INTERVAL = 24 * 60 * 60 * 1000;

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
export class I18nService implements OnModuleInit, OnModuleDestroy {
  #logger: Logger;
  #i18n: i18n.i18n;
  #i18nReload: NodeJS.Timer;

  #knownLanguages: Set<string>;
  #knownComponents: Set<string>;

  constructor(
    @Inject(I18N_SERVICE_CONFIGURATION)
    private readonly config: I18nServiceConfiguration,
  ) {
    this.#logger = new Logger('I18nService');
    this.#logger.debug(`Config: ${JSON.stringify(this.config)}`);
  }

  async onModuleInit() {
    const { languages, components } =
      await this.getAvailableLanguagesAndComponents();
    this.#knownLanguages = languages;
    this.#knownComponents = components;

    const url = `${this.config.http.url}/translations/ulep/{{ns}}/{{lng}}/file/`;

    this.#i18n = i18n.use(HttpBackend as unknown as i18n.Module);
    await this.#i18n.init({
      fallbackLng: this.config.fallbackLanguage || 'en',
      ns: [...components],
      debug: this.config.debug,
      preload: [...languages],
      backend: {
        loadPath: url,
        crossDomain: true,
        withCredentials: !!this.config.http.token,
        customHeaders: () => {
          return this.config.http.token
            ? {
                Authorization: `Token ${this.config.http.token}`,
              }
            : {};
        },
        reloadInterval:
          this.config.http.reloadInterval || DEFAULT_RELOAD_INTERVAL,
      },
    });

    this.#i18nReload = setInterval(
      () => this.loadNewLanguagesAndComponents,
      this.config.http.reloadInterval || DEFAULT_RELOAD_INTERVAL,
    );
  }

  onModuleDestroy() {
    if (this.#i18nReload) {
      clearInterval(this.#i18nReload);
    }
  }

  private async getAvailableLanguagesAndComponents(): Promise<{
    languages: Set<string>;
    components: Set<string>;
  }> {
    const translationsUrl = `${this.config.http.url}/translations/`;

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
      return {
        components: new Set(),
        languages: new Set(),
      };
    } else {
      const data = await res.json();
      return data.results.reduce(
        (acc, value) => {
          const code = value.language_code;
          const component = value.component.slug;

          // Glossary are components created by Weblate
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

  private async loadNewLanguagesAndComponents() {
    const { languages: updatedLanguages, components: updatedComponents } =
      await this.getAvailableLanguagesAndComponents();

    const newLanguages = [...updatedLanguages].filter(
      (language) => !this.#knownLanguages.has(language),
    );
    if (newLanguages.length > 0) {
      this.#logger.debug(`Languages to add: ${newLanguages.join(', ')}`);
      await this.#i18n.loadLanguages(newLanguages);
      for (const language of newLanguages) {
        this.#knownLanguages.add(language);
      }
      this.#logger.log(`Added languages: ${newLanguages.join(', ')}`);
    }

    const newComponents = [...updatedComponents].filter(
      (component) => !this.#knownComponents.has(component),
    );
    if (newComponents.length > 0) {
      this.#logger.debug(`Namespace to add: ${newComponents.join(', ')}`);
      await this.#i18n.loadNamespaces(newComponents);
      for (const component of newComponents) {
        this.#knownComponents.add(component);
      }
      this.#logger.log(`Added namespace: ${newComponents.join(', ')}`);
    }
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
