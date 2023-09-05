import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import {
  ProfileQueryOrderBy,
  ProfileQueryWhere,
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

  async create(profile: Profile): Promise<void> {
    await this.prisma.profiles.create({
      data: {
        id: profile.id,
        learning_type: profile.learningType,
        same_gender: profile.sameGender,
        same_age: profile.sameAge,
        meeting_frequency: profile.meetingFrequency,
        bio: profile.biography,
        certificate_option: profile.certificateOption,
        specific_program: profile.specificProgram,
        User: {
          connect: { id: profile.user.id },
        },
        NativeLanguage: {
          connect: { id: profile.nativeLanguage.id },
        },
        LearningLanguages: {
          create: profile.learningLanguages.map((learningLanguage) => {
            return {
              LanguageCode: {
                connect: { code: learningLanguage.language.code },
              },
              level: learningLanguage.level,
            };
          }),
        },
        MasteredLanguages: {
          create: profile.masteredLanguages.map((language) => {
            return { LanguageCode: { connect: { code: language.code } } };
          }),
        },
        Goals: {
          connect: profile.objectives.map((goal) => ({ id: goal.id })),
        },
        Interests: {
          connect: profile.interests.map((interest) => ({ id: interest.id })),
        },
        Campus: profile.campus && {
          connect: { id: profile.campus.id },
        },
      },
    });
  }

  async findAll(
    offset?: number,
    limit?: number,
    orderBy?: ProfileQueryOrderBy,
    where?: ProfileQueryWhere,
  ): Promise<Collection<Profile>> {
    const wherePayload = where
      ? {
          User: {
            country_code_id: where.user.country,
            email: where.user.email,
            firstname: where.user.firstname,
            lastname: where.user.lastname,
            organization_id: where.user.university,
            role: where.user.role,
          },
          MasteredLanguages: {
            every: { LanguageCode: { code: where.masteredLanguageCode } },
          },
          NativeLanguage: { code: where.nativeLanguageCode },
        }
      : {};

    const count = await this.prisma.profiles.count({
      where: wherePayload,
    });

    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    let order;
    if (orderBy.field === 'university') {
      order = { User: { Organization: { name: orderBy.order } } };
    } else if (orderBy.field) {
      order = { User: { [orderBy.field]: orderBy.order } };
    }

    const users = await this.prisma.profiles.findMany({
      where: wherePayload,
      skip: offset,
      orderBy: order,
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
