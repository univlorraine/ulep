import { Injectable } from '@nestjs/common';
import { UniversityRepository } from 'src/core/ports/university.repository';
import { PrismaService } from '../prisma.service';
import { University } from 'src/core/models/university';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({ where: { id } });

    if (!result) {
      return null;
    }

    return new University(result.id, result.name);
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
    });

    const universities = items.map(
      (item) => new University(item.id, item.name),
    );

    return { items: universities, total: count };
  }

  async findByName(name: string): Promise<University | null> {
    const result = await this.prisma.organization.findUnique({
      where: { name },
    });

    if (!result) {
      return null;
    }

    return new University(result.id, result.name);
  }

  async save({ id, name }: University): Promise<void> {
    await this.prisma.organization.upsert({
      where: { id },
      update: { name },
      create: { id, name },
    });
  }

  async delete(university: University): Promise<void> {
    await this.prisma.organization.delete({ where: { id: university.id } });
  }
}
