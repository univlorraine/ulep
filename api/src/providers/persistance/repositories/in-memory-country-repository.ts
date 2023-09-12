import { Injectable } from '@nestjs/common';
import {
  CountryFilters,
  CountryRepository,
} from '../../../core/ports/country.repository';
import {
  CountryCode,
  CountryWithUniversities,
} from 'src/core/models/country-code.model';
import { Collection } from '@app/common';

@Injectable()
export class InMemoryCountryCodesRepository implements CountryRepository {
  #countries: CountryCode[] = [];

  get countries(): CountryCode[] {
    return this.#countries;
  }

  init(countries: CountryCode[]): void {
    this.#countries = countries;
  }

  reset(): void {
    this.#countries = [];
  }

  async all(filters: CountryFilters): Promise<Collection<CountryCode>> {
    let countries = this.#countries;

    if (filters.where?.enable) {
      countries = countries.filter(
        (country) => country.enable === filters.where.enable,
      );
    }

    if (!filters.pagination) {
      return { items: countries, totalItems: countries.length };
    }

    const { page, limit } = filters.pagination;

    const offset = page > 0 ? (page - 1) * limit : 0;
    if (offset >= countries.length) {
      return { items: [], totalItems: countries.length };
    }

    countries = countries.sort((a, b) => {
      if (filters.orderBy?.name === 'asc') {
        return a.name.localeCompare(b.name);
      }

      if (filters.orderBy?.name === 'desc') {
        return b.name.localeCompare(a.name);
      }

      return 0;
    });

    return {
      items: countries.slice(offset, offset + limit),
      totalItems: countries.length,
    };
  }

  async allWithUniversities(): Promise<CountryWithUniversities[]> {
    //TODO: update this later for tests
    return [];
  }

  async ofId(id: string): Promise<CountryCode> {
    return this.#countries.find((country) => country.id === id);
  }

  async ofCode(code: string): Promise<CountryCode | null> {
    return this.#countries.find((country) => country.code === code);
  }

  async toogleStatus(id: string, enable: boolean): Promise<void> {
    const country = this.#countries.find((country) => country.id === id);

    if (!country) {
      return;
    }

    country.enable = enable;
  }
}
