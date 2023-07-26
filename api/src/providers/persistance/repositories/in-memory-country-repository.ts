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

  async ofCode(code: string): Promise<Country> {
    return this.#countries.find((country) => country.code === code);
  }

  async save(country: Country): Promise<void> {
    if (this.#countries.find((c) => c.code === country.code)) {
      return;
    }

    this.#countries.push(country);
  }
}
