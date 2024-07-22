import { Collection, SortOrder } from '@app/common';
import { Language, LanguageStatus, SuggestedLanguage } from '../models';

export const LANGUAGE_REPOSITORY = 'language-code.repository';

export type LanguageQuerySortFilter =
  | 'code'
  | 'name'
  | 'mainUniversityStatus'
  | 'secondaryUniversityActive'
  | 'isDiscovery';

export type SuggestedLanguageOrderKey =
  | 'email'
  | 'firstname'
  | 'lastname'
  | 'role'
  | 'code';

export interface LanguageQueryOrderBy {
  field?: LanguageQuerySortFilter;
  order: SortOrder;
}

export type LanguageStatusFilter = LanguageStatus | 'PARTNER';

export type LanguageFilters = {
  code?: string;
  name?: string;
};

export type LanguagePagination = {
  limit?: number;
  page?: number;
};

export interface SuggestedLanguageQueryOrderBy {
  field?: SuggestedLanguageOrderKey;
  order: SortOrder;
}

export interface LanguageRepository {
  addRequest(code: string, user: string): Promise<void>;

  all(
    orderBy: LanguageQueryOrderBy,
    status?: LanguageStatusFilter,
    pagination?: LanguagePagination,
    filters?: LanguageFilters,
  ): Promise<Collection<Language>>;

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

  update(language: Language): Promise<Language>;

  getLanguagesProposedToLearning(): Promise<Language[]>;

  getLanguagesSuggestedByUser(userId: string): Promise<SuggestedLanguage[]>;
}
