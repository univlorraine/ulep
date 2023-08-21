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
  ofId(id: string): Promise<Language>;

  ofCode(code: string): Promise<Language>;

  all(): Promise<Collection<Language>>;

  allRequests(
    offset?: number,
    limit?: number,
    orderBy?: SuggestedLanguageQueryOrderBy,
  ): Promise<Collection<SuggestedLanguage>>;

  addRequest(code: string, user: string): Promise<void>;

  countRequests(code: string): Promise<number>;
}
