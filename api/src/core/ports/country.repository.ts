import { Country } from '../models/country';

export interface CountryRepository {
  of: (id: string) => Promise<Country | null>;

  where: (query: { code?: string; name?: string }) => Promise<Country | null>;
}
