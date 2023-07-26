import { Injectable } from '@nestjs/common';
import { Country } from '../../../core/models/country';
import {
  CountryFilters,
  CountryRepository,
} from '../../../core/ports/country.repository';
import { PrismaService } from '../prisma.service';
import { Collection } from '../../../shared/types/collection';
import { countryMapper } from '../mappers/country.mapper';

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: CountryFilters): Promise<Collection<Country>> {
    const countries = await this.prisma.country.findMany({
      ...filters,
    });

    if (!countries) {
      return { items: [], totalItems: 0 };
    }

    return {
      items: countries.map(countryMapper),
      totalItems: countries.length,
    };
  }

  async ofCode(code: string): Promise<Country | null> {
    const country = await this.prisma.country.findUnique({
      where: {
        code: code,
      },
    });

    if (!country) {
      return null;
    }

    return countryMapper(country);
  }

  async save(country: Country): Promise<void> {
    await this.prisma.country.create({
      data: {
        code: country.code,
        name: country.name,
      },
    });
  }
}
