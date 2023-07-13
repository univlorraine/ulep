import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProfileRepository } from '../../../core/ports/profile.repository';
import { profileMapper } from '../mappers/profile.mapper';
import { Profile } from '../../../core/models/profile';
import { Collection } from '../../../shared/types/collection';
import { StringFilter } from 'src/shared/types/filters';

const Relations = {
  user: true,
  university: { include: { country: true } },
  nationality: true,
  nativeLanguage: true,
  masteredLanguages: { include: { language: true } },
  learningLanguage: true,
  avatar: true,
};

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  private readonly logger = new Logger(PrismaProfileRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string) {
    const entry = await this.prisma.profile.findUnique({
      where: { id },
      include: Relations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofUser(id: string): Promise<Profile> {
    const entry = await this.prisma.profile.findUnique({
      where: { userId: id },
      include: Relations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async where(props: {
    nativeLanguageCode: string;
    learningLanguageCode: string;
  }) {
    const entries = await this.prisma.profile.findMany({
      where: {
        nativeLanguage: { is: { code: props.nativeLanguageCode } },
        learningLanguage: { is: { code: props.learningLanguageCode } },
      },
      include: Relations,
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
      include: Relations,
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
      age: profile.age,
      gender: profile.gender,
      role: profile.role,
      nativeLanguage: {
        connect: {
          code: profile.nativeLanguage.code,
        },
      },
      learningLanguage: {
        connect: {
          code: profile.learningLanguage.code,
        },
      },
      learningLanguageLevel: profile.learningLanguageLevel,
      metadata: {
        goals: Array.from(profile.goals),
        meetingFrequency: profile.preferences.meetingFrequency,
        interests: Array.from(profile.interests),
        bios: profile.bios,
        preferSameGender: profile.preferences.sameGender,
      },
      university: {
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

    this.logger.debug(payload.learningLanguageLevel);

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
