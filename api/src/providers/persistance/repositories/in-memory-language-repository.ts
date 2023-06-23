import { Language } from '../../../core/models/language';
import { LanguageRepository } from '../../../core/ports/language.repository';
import { Collection } from '../../../shared/types/collection';

export class InMemoryLanguageRepository implements LanguageRepository {
  #languages: Language[] = [];

  init(languages: Language[]): void {
    this.#languages = languages;
  }

  reset(): void {
    this.#languages = [];
  }

  get languages(): Language[] {
    return this.#languages;
  }

  async all(offset: number, limit: number): Promise<Collection<Language>> {
    return {
      items: this.#languages.slice(offset, offset + limit),
      totalItems: this.#languages.length,
    };
  }

  async of(id: string): Promise<Language> {
    return this.#languages.find((language) => language.id === id);
  }

  async where(query: { code?: string }): Promise<Language> {
    if (!query.code) {
      throw new Error('Missing code');
    }

    return this.#languages.find((language) => language.code === query.code);
  }

  async save(language: Language): Promise<void> {
    this.#languages.push(language);
  }
}
