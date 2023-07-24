import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  ProfileFilters,
  ProfileRepository,
} from '../../../core/ports/profile.repository';
import { profileMapper } from '../mappers/profile.mapper';
import { Profile } from '../../../core/models/profile';
import { Collection } from '../../../shared/types/collection';
import { StringFilter } from 'src/shared/types/filters';
import { UniversityRelations } from './prisma-university-repository';

export const ProfilesRelations = {
  user: true,
  university: {
    include: UniversityRelations,
  },
  nativeLanguage: true,
  masteredLanguages: { include: { language: true } },
  learningLanguage: true,
  preferences: true,
};

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string) {
    const entry = await this.prisma.profile.findUnique({
      where: { id },
      include: ProfilesRelations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofUser(id: string): Promise<Profile> {
    const entry = await this.prisma.profile.findUnique({
      where: { userId: id },
      include: ProfilesRelations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async availableProfiles(filters?: ProfileFilters): Promise<Profile[]> {
    const entries = await this.prisma.profile.findMany({
      where: {
        tandems: {
          none: { tandem: { status: 'active' } },
        },
        nativeLanguageCode: filters?.nativeLanguageCode,
      },
      include: ProfilesRelations,
    });

    return entries.map(profileMapper);
  }

  async findAll(
    offset?: number,
    limit?: number,
    where?: { email?: StringFilter },
  ): Promise<Collection<Profile>> {
    const count = await this.prisma.profile.count({
      where: {
        user: {
          email: where?.email,
        },
      },
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const items = await this.prisma.profile.findMany({
      where: {
        user: {
          email: where?.email,
        },
      },
      skip: offset,
      take: limit,
      include: ProfilesRelations,
    });

    const profiles = items.map(profileMapper);

    return { items: profiles, totalItems: count };
  }

  async create(profile: Profile): Promise<void> {
    await this.prisma.profile.create({
      data: {
        id: profile.id,
        user: {
          connect: { id: profile.user.id },
        },
        age: profile.personalInformation.age,
        gender: profile.personalInformation.gender,
        role: profile.role,
        university: {
          connect: { id: profile.university.id },
        },
        nativeLanguage: {
          connect: { code: profile.languages.nativeLanguage },
        },
        learningLanguage: {
          connect: { code: profile.languages.learningLanguage },
        },
        learningLanguageLevel: profile.languages.learningLanguageLevel,
        masteredLanguages: {
          create: profile.languages.masteredLanguages.map((language) => ({
            languageCode: language,
          })),
        },
        preferences: {
          create: {
            type: profile.preferences.learningType,
            sameGender: profile.preferences.sameGender,
          },
        },
        metadata: {
          frequency: profile.preferences.meetingFrequency,
          goals: profile.preferences.goals,
          interests: profile.personalInformation.interests,
          bios: profile.personalInformation.bio,
        },
      },
    });
  }

  async update(profile: Profile): Promise<void> {
    await this.prisma.profile.update({
      where: { id: profile.id },
      data: {
        learningLanguageLevel: profile.languages.learningLanguageLevel,
      },
    });
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profile.delete({ where: { id: profile.id } });
  }
}
