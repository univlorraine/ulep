import { Collection, ModeQuery, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Profile, WithoutTandem } from 'src/core/models';
import { ProfileWithTandemsProfiles } from 'src/core/models/profileWithTandemsProfiles.model';
import {
  ProfileQueryOrderBy,
  ProfileQueryWhere,
  ProfileRepository,
  ProfileWithTandemsProfilesQueryWhere,
} from 'src/core/ports/profile.repository';
import {
  profileMapper,
  ProfilesRelations,
  ProfilesRelationsWithTandemProfile,
  profileWithTandemsProfilesMapper,
} from '../mappers';

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

  async ofIdWithTandemsProfiles(
    id: string,
  ): Promise<ProfileWithTandemsProfiles | null> {
    const entry = await this.prisma.profiles.findUnique({
      where: { id },
      include: ProfilesRelationsWithTandemProfile,
    });

    if (!entry) {
      return null;
    }

    return profileWithTandemsProfilesMapper(entry);
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
        meeting_frequency: profile.meetingFrequency,
        availabilities: JSON.stringify(profile.availabilities),
        availabilities_note: profile.availabilitiesNote,
        availabilities_note_privacy: profile.availabilitiesNotePrivacy,
        bio: profile.biography,
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
              learning_type: learningLanguage.learningType,
              same_gender: learningLanguage.sameGender,
              same_age: learningLanguage.sameAge,
              has_priority: learningLanguage.hasPriority,
              same_tandem_email: learningLanguage.sameTandemEmail,
              certificate_option: learningLanguage.certificateOption,
              specific_program: learningLanguage.specificProgram,
              Campus: learningLanguage.campus && {
                connect: { id: learningLanguage.campus.id },
              },
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
            Nationality: { code: where.user.country },
            Organization: { id: where.user.university },
            email: where.user.email,
            firstname: where.user.firstname,
            lastname: where.user.lastname,
            role: where.user.role,
            status: where.user.status,
          },
          ...(where.masteredLanguageCode && {
            MasteredLanguages: {
              some: {
                LanguageCode: { code: where.masteredLanguageCode },
              },
            },
          }),
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

    let order = undefined;
    if (orderBy && orderBy.field === 'university') {
      order = { User: { Organization: { name: orderBy.order } } };
    } else if (orderBy) {
      order = { User: { [orderBy.field]: orderBy.order } };
    }

    const profiles = await this.prisma.profiles.findMany({
      where: wherePayload,
      skip: offset,
      orderBy: order,
      take: limit,
      include: ProfilesRelations,
    });

    return {
      items: profiles.map(profileMapper),
      totalItems: count,
    };
  }

  async findAllWithTandemsProfiles(
    offset?: number,
    limit?: number,
    where?: ProfileWithTandemsProfilesQueryWhere,
  ): Promise<Collection<ProfileWithTandemsProfiles>> {
    const learningLanguageWhere = [];
    if (where.learningLanguage) {
      learningLanguageWhere.push({
        LearningLanguages: {
          some: {
            LanguageCode: { id: where.learningLanguage },
          },
        },
      });
    }
    if (where.tandemStatus) {
      if (where.tandemStatus === WithoutTandem.NO_TANDEM) {
        learningLanguageWhere.push({
          LearningLanguages: {
            some: {
              Tandem: null,
            },
          },
        });
      } else {
        learningLanguageWhere.push({
          LearningLanguages: {
            some: {
              Tandem: {
                status: where.tandemStatus,
              },
            },
          },
        });
      }
    }

    const wherePayload: any = where
      ? {
          User: {
            Organization: { id: where.user.university },
            lastname: {
              contains: where.user.lastname,
              mode: ModeQuery.INSENSITIVE,
            },
            division: {
              equals: where.user.division,
            },
            NOT: {
              status: 'BANNED',
            },
          },
          ...(learningLanguageWhere.length > 0 && {
            AND: learningLanguageWhere,
          }),
          ...(where.learningType && {
            OR: [
              {
                LearningLanguages: {
                  some: {
                    AND: [
                      {
                        Tandem: null,
                      },
                      {
                        learning_type: where.learningType,
                      },
                    ],
                  },
                },
              },
              {
                LearningLanguages: {
                  some: {
                    Tandem: {
                      learning_type: where.learningType,
                    },
                  },
                },
              },
            ],
          }),
        }
      : {};

    const count = await this.prisma.profiles.count({
      where: wherePayload,
    });
    // If skip is out of range, return an empty array
    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const profiles = await this.prisma.profiles.findMany({
      where: wherePayload,
      skip: offset,
      take: limit,
      include: ProfilesRelationsWithTandemProfile,
    });

    const profilesWithLearningLanguages = profiles.filter(
      (profile) => profile.LearningLanguages.length !== 0,
    );

    return {
      items: profilesWithLearningLanguages.map(
        profileWithTandemsProfilesMapper,
      ),
      totalItems: count,
    };
  }

  async update(profile: Profile): Promise<Profile> {
    await this.prisma.profiles.update({
      where: { id: profile.id },
      data: {
        meeting_frequency: profile.meetingFrequency,
        availabilities: JSON.stringify(profile.availabilities),
        availabilities_note: profile.availabilitiesNote,
        availabilities_note_privacy: profile.availabilitiesNotePrivacy,
        bio: profile.biography,
        NativeLanguage: {
          connect: { id: profile.nativeLanguage.id },
        },
        MasteredLanguages: {
          deleteMany: { profile_id: profile.id },
          create: profile.masteredLanguages.map((language) => {
            return {
              LanguageCode: { connect: { code: language.code } },
            };
          }),
        },
        Goals: {
          set: [],
          connect: profile.objectives.map((goal) => ({ id: goal.id })),
        },
        Interests: {
          set: [],
          connect: profile.interests.map((interest) => ({ id: interest.id })),
        },
      },
    });

    const updatedProfile = await this.ofId(profile.id);

    return updatedProfile;
  }

  async delete(profile: Profile): Promise<void> {
    await this.prisma.profiles.delete({ where: { id: profile.id } });
  }

  async getProfilesSubscribedToEvent(
    eventId: string,
  ): Promise<Collection<Profile>> {
    const profiles = await this.prisma.profiles.findMany({
      where: {
        User: {
          Events: {
            some: { id: eventId },
          },
        },
      },
      include: ProfilesRelations,
    });
    return { items: profiles.map(profileMapper), totalItems: profiles.length };
  }
}
