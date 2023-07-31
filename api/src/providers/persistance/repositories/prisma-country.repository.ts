import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import {
  CountryFilters,
  CountryRepository,
} from 'src/core/ports/country.repository';
import { CountryCode } from 'src/core/models';

@Injectable()
export class PrismaCountryCodeRepository implements CountryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PrismaCountryCodeRepository.name);

  async all(filters: CountryFilters): Promise<Collection<CountryCode>> {
    const count = await this.prisma.countryCodes.count({
      where: {
        enable: filters.where?.enable,
      },
    });

    const offset = filters.page > 0 ? (filters.page - 1) * filters.limit : 0;
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const countries = await this.prisma.countryCodes.findMany({
      where: {
        enable: filters.where?.enable,
      },
      orderBy: {
        name: filters.orderBy?.name,
      },
      skip: offset,
      take: filters.limit,
    });

    return {
      items: countries,
      totalItems: count,
    };
  }

  async ofId(id: string): Promise<CountryCode> {
    const country = await this.prisma.countryCodes.findUnique({
      where: { id },
    });

    if (!country) {
      return null;
    }

    return country;
  }

  async ofCode(code: string): Promise<CountryCode | null> {
    const country = await this.prisma.countryCodes.findUnique({
      where: { code },
    });

    if (!country) {
      return null;
    }

    return country;
  }

  async toogleStatus(id: string, enable: boolean): Promise<void> {
    await this.prisma.countryCodes.update({
      where: { id },
      data: { enable },
    });
  }
}
