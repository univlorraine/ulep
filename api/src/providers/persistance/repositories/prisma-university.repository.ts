import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { UniversityRepository } from 'src/core/ports/university.repository';
import {
  UniversityRelations,
  universityMapper,
} from '../mappers/university.mapper';
import { Language, University } from 'src/core/models';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(university: University): Promise<University> {
    await this.prisma.organizations.create({
      data: {
        id: university.id,
        name: university.name,
        parent_id: university.parent,
        Places: {
          create: university.campus.map((name) => ({ name })),
        },
        Languages: {
          connect: university.languages.map((language) => ({
            code: language.code,
          })),
        },
        timezone: university.timezone,
        admissionStartDate: university.admissionStart,
        admissionEndDate: university.admissionEnd,
        website: university.website,
        resource: university.resourcesUrl,
      },
    });

    return university;
  }

  async findAll(): Promise<Collection<University>> {
    const count = await this.prisma.organizations.count();

    const universities = await this.prisma.organizations.findMany({
      include: UniversityRelations,
    });

    return new Collection<University>({
      items: universities.map(universityMapper),
      totalItems: count,
    });
  }

  async findUniversityCentral(): Promise<University | null> {
    const university = await this.prisma.organizations.findFirst({
      where: { parent_id: null },
      include: UniversityRelations,
    });

    if (!university) {
      return null;
    }

    return universityMapper(university);
  }

  async havePartners(id: string): Promise<boolean> {
    const count = await this.prisma.organizations.count({
      where: { parent_id: id },
    });

    return count > 0;
  }

  async ofId(id: string): Promise<University | null> {
    const result = await this.prisma.organizations.findUnique({
      where: { id },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async ofName(name: string): Promise<University | null> {
    const result = await this.prisma.organizations.findUnique({
      where: { name },
      include: UniversityRelations,
    });

    if (!result) {
      return null;
    }

    return universityMapper(result);
  }

  async languages(id: string): Promise<Language[]> {
    const university = await this.prisma.organizations.findUnique({
      where: { id },
      include: { Languages: true },
    });

    return university.Languages;
  }

  async addLanguage(language: Language, university: University): Promise<void> {
    await this.prisma.organizations.update({
      where: { id: university.id },
      data: {
        Languages: {
          connect: { code: language.code },
        },
      },
    });
  }

  async removeLanguage(
    language: Language,
    university: University,
  ): Promise<void> {
    await this.prisma.organizations.update({
      where: { id: university.id },
      data: {
        Languages: {
          disconnect: { code: language.code },
        },
      },
    });
  }

  async update(id: string, name: string): Promise<void> {
    await this.prisma.organizations.update({
      where: { id },
      data: { name },
    });
  }

  async remove(id: string): Promise<void> {
    await this.prisma.organizations.delete({ where: { id } });
  }
}
