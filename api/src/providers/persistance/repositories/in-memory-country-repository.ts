import { Country } from '../../../core/models/country';
import { Collection } from '../../../shared/types/collection';
import { CountryRepository } from '../../../core/ports/country.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InMemoryCountryRepository implements CountryRepository {
  #countries: Country[] = [];

  get countries(): Country[] {
    return this.#countries;
  }

  init(countries: Country[]): void {
    this.#countries = countries;
  }

  reset(): void {
    this.#countries = [];
  }

  async findAll(): Promise<Collection<Country>> {
    return {
      items: this.#countries,
      totalItems: this.#countries.length,
    };
  }

  async of(id: string): Promise<Country> {
    return this.#countries.find((country) => country.id === id);
  }

  async where(query: { code?: string; name?: string }): Promise<Country> {
    if (!query.code && !query.name) {
      throw new Error('No query provided');
    }

    if (query.code && query.name) {
      throw new Error('Only one query parameter is allowed');
    }

    if (query.code) {
      return this.#countries.find((country) => country.code === query.code);
    }

    return this.#countries.find((country) => country.name === query.name);
  }
}
