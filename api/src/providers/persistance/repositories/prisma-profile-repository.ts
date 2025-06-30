/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { Collection, ModeQuery, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Profile, WithoutTandem } from 'src/core/models';
import { ProfileWithLogEntries } from 'src/core/models/profileWithLogEntries.model';
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
import {
  ProfilesRelationsWithLogEntries,
  profileWithLogEntriesMapper,
} from '../mappers/profileWithLogEntries.mapper';

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
            Nationality: { code: where.user?.country },
            Organization: { id: where.user?.university },
            email: where.user?.email,
            firstname: where.user?.firstname,
            lastname: where.user?.lastname,
            role: where.user?.role,
            status: where.user?.status,
            division: where.user?.division,
          },
          ...(where.masteredLanguageCode && {
            MasteredLanguages: {
              some: {
                LanguageCode: { code: where.masteredLanguageCode },
              },
            },
          }),
          NativeLanguage: { code: where.nativeLanguageCode },
          ...(where.learningLanguageCode && {
            LearningLanguages: {
              some: {
                LanguageCode: { code: where.learningLanguageCode },
              },
            },
          }),
          ...(where.notSubscribedToEvent && {
            Events: {
              none: { id: where.notSubscribedToEvent },
            },
          }),
          ...(where.subscribedToEvent && {
            Events: {
              some: { id: where.subscribedToEvent },
            },
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

  async findAllWithLogEntries(
    offset?: number,
    limit?: number,
    forceGettingNoSharedProfiles: boolean = false,
  ): Promise<Collection<ProfileWithLogEntries>> {
    const whereCondition = !forceGettingNoSharedProfiles
      ? {
          LearningLanguages: {
            some: {
              shared_logs_date: { not: null },
            },
          },
        }
      : {};

    const profiles = await this.prisma.profiles.findMany({
      skip: offset,
      take: limit,
      include: ProfilesRelationsWithLogEntries,
      where: whereCondition,
    });

    const count = await this.prisma.profiles.count({});
    return {
      items: profiles.map(profileWithLogEntriesMapper),
      totalItems: count,
    };
  }

  async findByContactIdWithLogEntries(
    contactId: string,
    forceGettingNoSharedProfiles: boolean = false,
  ): Promise<ProfileWithLogEntries> {
    const profile = await this.prisma.profiles.findFirst({
      where: {
        User: { contact_id: contactId },
        LearningLanguages: {
          some: {
            shared_logs_date: !forceGettingNoSharedProfiles
              ? { not: null }
              : undefined,
          },
        },
      },
      include: ProfilesRelationsWithLogEntries,
    });

    return profileWithLogEntriesMapper(profile);
  }

  async findAllWithTandemsProfiles(
    offset?: number,
    limit?: number,
    where?: ProfileWithTandemsProfilesQueryWhere,
  ): Promise<Collection<ProfileWithTandemsProfiles>> {
    const learningLanguageWhere = [];
    if (where.learningLanguage && !where.tandemStatus) {
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
              AND: [
                {
                  Tandem: null,
                },
                {
                  LanguageCode: { id: where.learningLanguage },
                },
              ],
            },
          },
        });
      } else {
        learningLanguageWhere.push({
          LearningLanguages: {
            some: {
              AND: [
                {
                  Tandem: {
                    status: where.tandemStatus,
                  },
                  LanguageCode: { id: where.learningLanguage },
                },
              ],
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

  async findAllWithMasteredLanguageAndLearningLanguage(
    firstLanguageCode: string,
    secondLanguageCode: string,
  ): Promise<Profile[]> {
    const masteredLanguageCondition = (languageCode: string) => ({
      OR: [
        {
          MasteredLanguages: {
            some: { LanguageCode: { code: languageCode } },
          },
        },
        {
          NativeLanguage: { code: languageCode },
        },
      ],
    });

    const learningLanguageCondition = (languageCode: string) => ({
      LearningLanguages: {
        some: { LanguageCode: { code: languageCode } },
      },
    });

    const profiles = await this.prisma.profiles.findMany({
      where: {
        OR: [
          {
            AND: [
              masteredLanguageCondition(firstLanguageCode),
              learningLanguageCondition(secondLanguageCode),
            ],
          },
          {
            AND: [
              masteredLanguageCondition(secondLanguageCode),
              learningLanguageCondition(firstLanguageCode),
            ],
          },
        ],
      },
      include: ProfilesRelations,
    });

    return profiles.map(profileMapper);
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
}
