import { Injectable } from '@nestjs/common';
import { StringFilter, Collection, PrismaService } from '@app/common';
import {
  MaxTandemsCountAndLanguageProps,
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

  async whereMaxTandemsCountAndLanguage(
    props: MaxTandemsCountAndLanguageProps,
  ): Promise<Profile[]> {
    const result: any[] = await this.prisma.$queryRaw`
    SELECT p.id
    FROM profiles p
    LEFT JOIN (
      SELECT pot.profile_id, COUNT(*) AS tandem_count
      FROM profiles_on_tandems pot
      JOIN tandems t ON pot.tandem_id = t.id
      WHERE t.status != 'INACTIVE'
      GROUP BY pot.profile_id
    ) AS tandems_count ON p.id = tandems_count.profile_id
    WHERE (tandems_count.tandem_count < ${props.tandemsCount} OR tandems_count.tandem_count IS NULL)
      AND p.native_language_code_id != ${props.nativeLanguage.not}
  `;

    const profileIds = result.map((row) => row.id);

    const profiles = await this.prisma.profiles.findMany({
      where: { id: { in: profileIds } },
      include: ProfilesRelations,
    });

    return profiles.map(profileMapper);
  }

  async whereMaxTandemsCount(max: number): Promise<Profile[]> {
    const result: any[] = await this.prisma.$queryRaw`
    SELECT p.id
    FROM profiles p
    LEFT JOIN (
      SELECT pot.profile_id, COUNT(*) AS tandem_count
      FROM profiles_on_tandems pot
      JOIN tandems t ON pot.tandem_id = t.id
      WHERE t.status != 'INACTIVE'
      GROUP BY pot.profile_id
    ) AS tandems_count ON p.id = tandems_count.profile_id
    WHERE tandems_count.tandem_count < ${max} OR tandems_count.tandem_count IS NULL
  `;

    const profileIds = result.map((row) => row.id);

    const profiles = await this.prisma.profiles.findMany({
      where: { id: { in: profileIds } },
      include: ProfilesRelations,
    });

    return profiles.map(profileMapper);
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
        User: {
          connect: { id: profile.user.id },
        },
        NativeLanguage: {
          connect: { id: profile.nativeLanguage.id },
        },
        LearningLanguage: profile.learningLanguage?.id && {
          connect: { id: profile.learningLanguage.id },
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
        level: profile.level,
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
