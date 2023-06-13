import { Injectable } from '@nestjs/common';
import { Country } from 'src/core/models/country';
import { CountryRepository } from 'src/core/ports/country.repository';
import { PrismaService } from '../prisma.service';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaCountryRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<Country | null> {
    const country = await this.prisma.countryCode.findUnique({
      where: {
        id: id,
      },
    });

    if (!country) {
      return null;
    }

    return country;
  }

  async findAll(): Promise<Collection<Country>> {
    const countries = await this.prisma.countryCode.findMany();

    if (!countries) {
      return { items: [], total: 0 };
    }

    return { items: countries, total: countries.length };
  }

  async where(query: {
    code?: string;
    name?: string;
  }): Promise<Country | null> {
    const country = await this.prisma.countryCode.findFirst({
      where: {
        code: query.code,
        name: query.name,
      },
    });

    if (!country) {
      return null;
    }

    return country;
  }
}
