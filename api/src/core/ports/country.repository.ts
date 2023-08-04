import { Collection, SortOrder } from '@app/common';
import { CountryCode } from '../models';

export const COUNTRY_REPOSITORY = 'country.repository';

export type CountryFilters = {
  where?: { enable?: boolean };
  orderBy?: { name: SortOrder };
  pagination?: { page: number; limit: number };
};

export interface CountryRepository {
  all(filters: CountryFilters): Promise<Collection<CountryCode>>;

  ofId(id: string): Promise<CountryCode | null>;

  ofCode(code: string): Promise<CountryCode | null>;

  toogleStatus(id: string, enable: boolean): Promise<void>;
}
