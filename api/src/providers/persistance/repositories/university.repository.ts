import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { University } from 'src/core/models/university';
import { Collection } from 'src/shared/types/collection';
import { universityMapper } from 'src/providers/persistance/mappers/university.mapper';
import { UniversityRepository } from 'src/core/ports/university.repository';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({
      where: { id },
      include: { country: true },
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async findAll(offset = 0, limit = 30): Promise<Collection<University>> {
    const count = await this.prisma.organization.count();

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const items = await this.prisma.organization.findMany({
      skip: offset,
      take: limit,
      include: { country: true },
    });

    const universities: University[] = items.map((item) =>
      universityMapper(item),
    );

    return { items: universities, totalItems: count };
  }

  async ofName(name: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({
      where: { name },
      include: { country: true },
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async save(university: University): Promise<void> {
    await this.prisma.organization.upsert({
      where: { id: university.id },
      update: {
        name: university.name,
        timezone: university.timezone,
        countryId: university.country.id,
        admissionStart: university.admissionStart,
        admissionEnd: university.admissionEnd,
      },
      create: {
        name: university.name,
        timezone: university.timezone,
        countryId: university.country.id,
        admissionStart: university.admissionStart,
        admissionEnd: university.admissionEnd,
      },
    });
  }

  async delete(university: University): Promise<void> {
    await this.prisma.organization.delete({ where: { id: university.id } });
  }
}
