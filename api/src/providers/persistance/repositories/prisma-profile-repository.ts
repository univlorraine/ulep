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

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly _include = {
    user: true,
    organization: { include: { country: true } },
    learningLanguage: { include: { languageCode: true } },
    nativeLanguage: { include: { languageCode: true } },
    nationality: true,
    avatar: true,
  };

  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string) {
    const entry = await this.prisma.profile.findUnique({
      where: { id },
      include: this._include,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofUser(id: string): Promise<Profile> {
    const entry = await this.prisma.profile.findUnique({
      where: { userId: id },
      include: this._include,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async where(props: ProfileFilters) {
    const entries = await this.prisma.profile.findMany({
      where: {
        nativeLanguage: {
          is: { languageCode: { code: props.nativeLanguageCode } },
        },
        learningLanguage: {
          is: { languageCode: { code: props.learningLanguageCode } },
        },
      },
      include: this._include,
    });

    return entries.map(profileMapper);
  }

  async findAll(
    offset?: number,
    limit?: number,
    where?: { lastname?: StringFilter },
  ): Promise<Collection<Profile>> {
    const count = await this.prisma.profile.count({
      where: { ...where },
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const items = await this.prisma.profile.findMany({
      where: { ...where },
      skip: offset,
      take: limit,
      include: this._include,
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
      firstname: profile.firstname,
      lastname: profile.lastname,
      birthdate: new Date(profile.birthdate),
      gender: profile.gender,
      role: profile.role,
      nativeLanguage: {
        create: {
          languageCode: {
            connect: {
              code: profile.nativeLanguage.code,
            },
          },
        },
      },
      learningLanguage: {
        create: {
          languageCode: {
            connect: {
              code: profile.learningLanguage.code,
            },
          },
          proficiencyLevel: profile.learningLanguage.level,
        },
      },
      metadata: {
        goals: Array.from(profile.goals),
        meetingFrequency: profile.preferences.meetingFrequency,
        interests: Array.from(profile.interests),
        bios: profile.bios,
        preferSameGender: profile.preferences.sameGender,
      },
      organization: {
        connect: {
          id: profile.university.id,
        },
      },
      nationality: {
        connect: {
          id: profile.nationality.id,
        },
      },
    };

    await this.prisma.profile.upsert({
      where: { id: profile.id },
      update: payload,
      create: payload,
    });
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profile.delete({ where: { id: profile.id } });
  }
}
