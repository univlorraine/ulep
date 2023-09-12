import { Collection } from '@app/common';
import {
  Language,
  LanguageStatus,
  SuggestedLanguage,
} from 'src/core/models/language.model';

import { LanguageRepository } from 'src/core/ports/language.repository';

export class InMemoryLanguageRepository implements LanguageRepository {
  #languages: Language[] = [];
  #requests: SuggestedLanguage[] = [];

  init(languages: Language[]): void {
    this.#languages = languages;
  }

  reset(): void {
    this.#languages = [];
  }

  create(language: Language): Promise<Language> {
    this.#languages.push(language);

    return Promise.resolve(language);
  }

  ofId(languageId: string): Promise<Language> {
    return Promise.resolve(
      this.#languages.find((language) => language.id === languageId),
    );
  }

  async ofCode(code: string): Promise<Language> {
    return this.#languages.find((language) => language.code === code);
  }

  async all(): Promise<Collection<Language>> {
    return new Collection<Language>({
      items: this.#languages,
      totalItems: this.#languages.length,
    });
  }

  async allRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<SuggestedLanguage>> {
    const allItems = Array.from(this.#requests.values());

    return {
      items: allItems.slice(offset, offset + limit),
      totalItems: allItems.length,
    };
  }

  countAllRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<{ language: Language; count: number }>> {
    const languageCounts: {
      [key: string]: { language: Language; count: number };
    } = this.#requests.reduce((acc, request) => {
      const languageCode = request.language.code;
      if (!acc[languageCode]) {
        acc[languageCode] = { language: request.language, count: 0 };
      }
      acc[languageCode].count += 1;
      return acc;
    }, {});

    const sortedLanguages = Object.values(languageCounts).sort(
      (a, b) => b.count - a.count,
    );

    const paginatedResults = sortedLanguages.slice(offset, offset + limit);

    return Promise.resolve(
      new Collection<{ language: Language; count: number }>({
        items: paginatedResults,
        totalItems: sortedLanguages.length,
      }),
    );
  }

  remove(language: Language): Promise<void> {
    this.#languages = this.#languages.filter((l) => l.id !== language.id);

    return Promise.resolve();
  }

  async addRequest(code: string, user: string): Promise<void> {
    this.#requests[code] = [...(this.#requests[code] || []), user];
  }

  async countRequests(code: string): Promise<number> {
    return this.#requests[code]?.length || 0;
  }

  update(language: Language): Promise<Language> {
    const index = this.#languages.findIndex((obj) => obj.id === language.id);

    if (index === -1) {
      return Promise.reject(null);
    }

    this.#languages[index] = language;

    return Promise.resolve(language);
  }

  getLanguagesProposedToLearning(): Promise<Language[]> {
    const res = this.#languages.filter(
      (language) => language.mainUniversityStatus === LanguageStatus.PRIMARY,
    );
    return Promise.resolve(res);
  }
}
