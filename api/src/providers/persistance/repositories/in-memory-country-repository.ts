import { Injectable } from '@nestjs/common';
import {
  CountryFilters,
  CountryRepository,
} from '../../../core/ports/country.repository';
import { CountryCode } from 'src/core/models/country-code.model';
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

  async all({ page, limit }: CountryFilters): Promise<Collection<CountryCode>> {
    const offset = page > 0 ? (page - 1) * limit : 0;
    const totalItems = this.#countries.length;

    return {
      items: this.#countries.slice(
        offset,
        Math.min(offset + limit, totalItems),
      ),
      totalItems: totalItems,
    };
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
