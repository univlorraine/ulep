import { Injectable } from '@nestjs/common';
import { Country } from '../../../core/models/country';
import { CountryRepository } from '../../../core/ports/country.repository';
import { PrismaService } from '../prisma.service';
import { Collection } from '../../../shared/types/collection';
import { countryMapper } from '../mappers/country.mapper';

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<Country | null> {
    const country = await this.prisma.country.findUnique({
      where: {
        id: id,
      },
    });

    if (!country) {
      return null;
    }

    return countryMapper(country);
  }

  async findAll(): Promise<Collection<Country>> {
    const countries = await this.prisma.country.findMany();

    if (!countries) {
      return { items: [], totalItems: 0 };
    }

    return {
      items: countries.map(countryMapper),
      totalItems: countries.length,
    };
  }

  async where(query: {
    code?: string;
    name?: string;
  }): Promise<Country | null> {
    const country = await this.prisma.country.findFirst({
      where: {
        code: query.code,
        name: query.name,
      },
    });

    if (!country) {
      return null;
    }

    return countryMapper(country);
  }
}
