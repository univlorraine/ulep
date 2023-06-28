import { Collection } from '../../shared/types/collection';
import { Country } from '../models/country';

export interface CountryRepository {
  findAll: () => Promise<Collection<Country>>;

  of: (id: string) => Promise<Country | null>;

  where: (query: { code?: string; name?: string }) => Promise<Country | null>;
}
