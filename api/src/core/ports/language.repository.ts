import { Collection } from '../../shared/types/collection';
import { Language } from '../models/language';

export type LanguageCombination = {
  learningLanguage: string;
  nativeLanguage: string;
};

export interface LanguageRepository {
  all: (offset?: number, limit?: number) => Promise<Collection<Language>>;

  ofCode: (code: string) => Promise<Language | null>;

  getUniqueCombinations: () => Promise<LanguageCombination[]>;

  save: (language: Language) => Promise<void>;

  addRequest(code: string, user: string): Promise<void>;

  countRequests(code: string): Promise<number>;
}
