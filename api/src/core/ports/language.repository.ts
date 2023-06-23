import { Collection } from '../../shared/types/collection';
import { Language } from '../models/language';

export interface LanguageRepository {
  all: (offset?: number, limit?: number) => Promise<Collection<Language>>;

  of: (id: string) => Promise<Language | null>;

  where: (query: { code?: string }) => Promise<Language | null>;

  save: (language: Language) => Promise<void>;
}
