import { Injectable } from '@nestjs/common';
import { StringFilter, Collection, PrismaService } from '@app/common';
import {
  ProfileFilters,
  ProfileRepository,
} from 'src/core/ports/profile.repository';
import { Profile } from 'src/core/models';
import { ProfilesRelations, profileMapper } from '../mappers';

@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<Profile | null> {
    const entry = await this.prisma.profiles.findUnique({
      where: { id },
      include: ProfilesRelations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async ofUser(id: string): Promise<Profile | null> {
    const entry = await this.prisma.profiles.findUnique({
      where: { user_id: id },
      include: ProfilesRelations,
    });

    if (!entry) {
      return null;
    }

    return profileMapper(entry);
  }

  async availableOnly(filters?: ProfileFilters): Promise<Profile[]> {
    const entries = await this.prisma.profiles.findMany({
      where: {
        Tandems: {
          none: { Tandem: { status: 'active' } },
        },
        NativeLanguage: {
          isNot: { code: filters?.nativeLanguageCode?.not },
          is: { code: filters?.nativeLanguageCode?.equals },
        },
      },
      include: ProfilesRelations,
    });

    return entries.map(profileMapper);
  }

  async create(profile: Profile): Promise<void> {
    await this.prisma.profiles.create({
      data: {
        id: profile.id,
        learning_type: profile.learningType,
        same_gender: profile.sameGender,
        same_age: profile.sameAge,
        meeting_frequency: profile.meetingFrequency,
        bio: profile.bio,
        User: {
          connect: { id: profile.user.id },
        },
        NativeLanguage: {
          connect: { id: profile.nativeLanguage.id },
        },
        LearningLanguage: {
          connect: { id: profile.learningLanguage.id },
        },
        level: profile.level,
        MasteredLanguages: {
          create: profile.masteredLanguages.map((language) => {
            return { LanguageCode: { connect: { code: language.code } } };
          }),
        },
        Goals: {
          connect: profile.goals.map((goal) => ({ id: goal.id })),
        },
        Interests: {
          connect: profile.interests.map((interest) => ({ id: interest.id })),
        },
        metadata: {
          // TODO
        },
      },
    });
  }

  async findAll(
    offset?: number,
    limit?: number,
    where?: { email?: StringFilter },
  ): Promise<Collection<Profile>> {
    const count = await this.prisma.profiles.count({
      where: { User: { email: where?.email } },
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const users = await this.prisma.profiles.findMany({
      where: { User: { email: where?.email } },
      skip: offset,
      take: limit,
      include: ProfilesRelations,
    });

    return {
      items: users.map(profileMapper),
      totalItems: count,
    };
  }

  async update(profile: Profile): Promise<void> {
    await this.prisma.profiles.update({
      where: { id: profile.id },
      data: {
        // TODO
      },
    });
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profiles.delete({ where: { id: profile.id } });
  }
}
