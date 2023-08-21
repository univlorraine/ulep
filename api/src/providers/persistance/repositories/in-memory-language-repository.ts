import { Collection } from '@app/common';
import { Language, SuggestedLanguage } from 'src/core/models/language.model';
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
}
