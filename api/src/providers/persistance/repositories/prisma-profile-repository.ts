import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileRepository } from '../../../core/ports/profile.repository';
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
  private readonly logger = new Logger(PrismaProfileRepository.name);

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

  async availableProfiles(): Promise<Profile[]> {
    const entries = await this.prisma.profile.findMany({
      where: {
        tandems: {
          none: { tandem: { status: 'active' } },
        },
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

  async save(profile: Profile): Promise<void> {
    const payload = {
      id: profile.id,
      user: {
        connect: { id: profile.user.id },
      },
      university: {
        connect: { id: profile.university.id },
      },
      age: profile.personalInformation.age,
      gender: profile.personalInformation.gender,
      role: profile.role,
      nativeLanguage: {
        connect: { code: profile.languages.nativeLanguage },
      },
      learningLanguage: {
        connect: { code: profile.languages.learningLanguage },
      },
      learningLanguageLevel: profile.languages.learningLanguageLevel,
      metadata: {
        interests: Array.from(profile.personalInformation.interests),
        bios: profile.personalInformation.bio,
      },
    };

    const preferences = {
      type: profile.preferences.learningType,
      sameGender: profile.preferences.sameGender,
      goal: profile.preferences.goals[0], // TODO: Fix this
      frequency: profile.preferences.meetingFrequency,
      availability: {
        // TODO
        tuesday: true,
        monday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    };

    this.logger.debug(payload.learningLanguageLevel);

    await this.prisma.profile.upsert({
      where: { id: profile.id },
      update: {
        ...payload,
        preferences: { update: preferences },
      },
      create: {
        ...payload,
        preferences: { create: preferences },
      },
    });
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profile.delete({ where: { id: profile.id } });
  }
}
