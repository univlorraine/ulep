import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { UniversityRepository } from 'src/core/ports/university.repository';
import {
  UniversityRelations,
  universityMapper,
} from '../mappers/university.mapper';
import { University } from 'src/core/models';

@Injectable()
export class PrismaUniversityRepository implements UniversityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(university: University): Promise<University> {
    await this.prisma.organizations.create({
      data: {
        id: university.id,
        name: university.name,
        Parent: university.parent
          ? { connect: { id: university.parent } }
          : undefined,
        Country: {
          connect: { id: university.country.id },
        },
        Places: {
          create: university.campus.map((campus) => ({
            id: campus.id,
            name: campus.name,
          })),
        },
        SpecificLanguagesAvailable: {
          connect: university.specificLanguagesAvailable.map((language) => ({
            id: language.id,
          })),
        },
        NativeLanguage: {
          connect: { id: university.nativeLanguage.id },
        },
        timezone: university.timezone,
        admissionStartDate: university.admissionStart,
        admissionEndDate: university.admissionEnd,
        openServiceDate: university.openServiceDate,
        closeServiceDate: university.closeServiceDate,
        website: university.website,
        codes: university.codes,
        domains: university.domains,
        pairing_mode: university.pairingMode,
        max_tandems_per_user: university.maxTandemsPerUser,
        notification_email: university.notificationEmail,
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

  async update(university: University): Promise<University> {
    await this.prisma.organizations.update({
      where: { id: university.id },
      data: {
        name: university.name,
        admissionEndDate: university.admissionEnd,
        admissionStartDate: university.admissionStart,
        openServiceDate: university.openServiceDate,
        closeServiceDate: university.closeServiceDate,
        timezone: university.timezone,
        codes: university.codes,
        domains: university.domains,
        website: university.website,
        Country: {
          connect: { id: university.country.id },
        },
        NativeLanguage: {
          connect: { id: university.nativeLanguage.id },
        },
        SpecificLanguagesAvailable: {
          set: [],
          connect: university.specificLanguagesAvailable.map((language) => ({
            id: language.id,
          })),
        },
        pairing_mode: university.pairingMode,
        max_tandems_per_user: university.maxTandemsPerUser,
        notification_email: university.notificationEmail,
        Contact: {
          connectOrCreate: {
            where: { id: university.defaultContactId },
            create: {
              id: university.defaultContactId,
            },
          },
        },
      },
    });

    // Update all users that have no contact with the universitie's default contact
    if (university.defaultContactId) {
      await this.prisma.users.updateMany({
        where: {
          AND: [{ organization_id: university.id }, { contact_id: null }],
        },
        data: { contact_id: university.defaultContactId },
      });
    }

    const updatedUniversity = await this.prisma.organizations.findUnique({
      where: { id: university.id },
      include: UniversityRelations,
    });

    return universityMapper(updatedUniversity);
  }

  async remove(id: string): Promise<void> {
    await this.prisma.organizations.delete({ where: { id } });
  }
}
