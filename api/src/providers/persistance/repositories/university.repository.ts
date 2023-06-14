import { Injectable } from '@nestjs/common';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { PrismaService } from '../prisma.service';
import { University } from 'src/core/models/university';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({
      where: { id },
      include: { country: true },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async findAll(offset = 0, limit = 30): Promise<Collection<University>> {
    const count = await this.prisma.organization.count();

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], total: count };
    }

    const items = await this.prisma.organization.findMany({
      skip: offset,
      take: limit,
      include: { country: true },
    });

    const universities: University[] = items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        timezone: item.timezone,
        country: item.country,
        countryId: item.countryId,
        admissionStart: item.admissionStart,
        admissionEnd: item.admissionEnd,
        createdAt: item.createdAt,
      };
    });

    return { items: universities, total: count };
  }

  async findByName(name: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({
      where: { name },
      include: { country: true },
    });

    if (!result) {
      return null;
    }

    return result;
  }

  async save(university: University): Promise<void> {
    await this.prisma.organization.upsert({
      where: { id: university.id },
      update: {
        name: university.name,
        timezone: university.timezone,
        countryId: university.countryId,
        admissionStart: university.admissionStart,
        admissionEnd: university.admissionEnd,
      },
      create: {
        name: university.name,
        timezone: university.timezone,
        countryId: university.countryId,
        admissionStart: university.admissionStart,
        admissionEnd: university.admissionEnd,
      },
    });
  }

  async delete(university: University): Promise<void> {
    await this.prisma.organization.delete({ where: { id: university.id } });
  }
}
