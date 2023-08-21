import { Collection, SortOrder } from '@app/common';
import { Language, SuggestedLanguage } from '../models';

export const LANGUAGE_REPOSITORY = 'language-code.repository';

export type SuggestedLanguageOrderKey =
  | 'email'
  | 'firstname'
  | 'lastname'
  | 'role'
  | 'code';

export interface SuggestedLanguageQueryOrderBy {
  field?: SuggestedLanguageOrderKey;
  order: SortOrder;
}

export interface LanguageRepository {
  addRequest(code: string, user: string): Promise<void>;

  all(): Promise<Collection<Language>>;

  allRequests(
    offset?: number,
    limit?: number,
    orderBy?: SuggestedLanguageQueryOrderBy,
  ): Promise<Collection<SuggestedLanguage>>;

  countAllRequests(
    offset?: number,
    limit?: number,
  ): Promise<Collection<{ language: Language; count: number }>>;

  countRequests(code: string): Promise<number>;

  ofId(id: string): Promise<Language>;

  ofCode(code: string): Promise<Language>;
}
