import { SortOrder } from 'src/shared/types/filters';
import { Collection } from '../../shared/types/collection';
import { Country } from '../models/country';

export type CountryFilters = {
  orderBy?: { name: SortOrder };
};

export interface CountryRepository {
  findAll: (filters: CountryFilters) => Promise<Collection<Country>>;

  ofCode: (code: string) => Promise<Country | null>;

  save: (country: Country) => Promise<void>;
}
