import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { University } from '../../../core/models/university';
import { Collection } from '../../../shared/types/collection';
import { universityMapper } from '../mappers/university.mapper';
import { UniversityRepository } from '../../../core/ports/university.repository';
import { Language } from 'src/core/models/language';

export const UniversityRelations = {
  languages: { include: { language: true } },
  campuses: true,
  parent: true,
};

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<University | null> {
    const result = await this.prisma.university.findUnique({
      where: { id },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async findAll(offset = 0, limit = 30): Promise<Collection<University>> {
    const count = await this.prisma.university.count();

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const items = await this.prisma.university.findMany({
      skip: offset,
      take: limit,
      include: UniversityRelations,
    });

    const universities: University[] = items.map((item) =>
      universityMapper(item),
    );

    return { items: universities, totalItems: count };
  }

  async ofName(name: string): Promise<University | null> {
    const result = await this.prisma.university.findUnique({
      where: { name },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async addLanguage(language: Language, university: University): Promise<void> {
    await this.prisma.university.update({
      where: { id: university.id },
      data: {
        languages: {
          create: {
            language: { connect: { code: language.code } },
          },
        },
      },
    });
  }

  async removeLanguage(code: string, university: University): Promise<void> {
    await this.prisma.universityLanguage.delete({
      where: {
        universityId_languageCode: {
          universityId: university.id,
          languageCode: code,
        },
      },
    });
  }

  async create(university: University): Promise<void> {
    await this.prisma.university.create({
      data: {
        id: university.id,
        name: university.name,
        parent: {
          connect: { id: university.parent },
        },
        campuses: {
          create: university.campus.map((name) => ({ name })),
        },
        languages: {
          create: university.languages.map((language) => ({
            language: { connect: { code: language.code } },
          })),
        },
        timezone: university.timezone,
        admissionStart: university.admissionStart,
        admissionEnd: university.admissionEnd,
      },
    });
  }

  async delete(university: University): Promise<void> {
    await this.prisma.university.delete({ where: { id: university.id } });
  }
}
