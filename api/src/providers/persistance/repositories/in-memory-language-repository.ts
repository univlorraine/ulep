import { Language } from '../../../core/models/language';
import {
  LanguageCombination,
  LanguageRepository,
} from '../../../core/ports/language.repository';
import { Collection } from '../../../shared/types/collection';

export class InMemoryLanguageRepository implements LanguageRepository {
  #languages: Language[] = [];
  #requests: { [code: string]: string[] } = {};

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

  async getUniqueCombinations(): Promise<LanguageCombination[]> {
    return [];
  }

  async ofCode(code: string): Promise<Language> {
    return this.#languages.find((language) => language.code === code);
  }

  async save(language: Language): Promise<void> {
    this.#languages.push(language);
  }

  async addRequest(code: string, user: string): Promise<void> {
    this.#requests[code] = [...(this.#requests[code] || []), user];
  }

  async countRequests(code: string): Promise<number> {
    return this.#requests[code]?.length || 0;
  }
}
