import { Language } from '../models';

export const LANGUAGE_REPOSITORY = 'language-code.repository';

export interface LanguageRepository {
  ofId(id: string): Promise<Language>;

  ofCode(code: string): Promise<Language>;

  all(): Promise<Language[]>;

  addRequest(code: string, user: string): Promise<void>;

  countRequests(code: string): Promise<number>;
}
