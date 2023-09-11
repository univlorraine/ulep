import {
  LearningLanguage,
  LearningLanguageWithTandem,
  TandemStatus,
} from 'src/core/models';
import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  LearningLanguageRepository,
  LearningLanguageRepositoryGetProps,
} from 'src/core/ports/learning-language.repository';
import {
  LearningLanguageRelations,
  LearningLanguageWithTandemRelations,
  learningLanguageMapper,
  learningLanguageWithTandemMapper,
} from '../mappers/learningLanguage.mapper';

@Injectable()
export class PrismaLearningLanguageRepository
  implements LearningLanguageRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async ofId(id: string): Promise<LearningLanguage> {
    const res = await this.prisma.learningLanguages.findUnique({
      where: { id },
      include: LearningLanguageRelations,
    });

    if (!res) {
      return null;
    }

    return learningLanguageMapper(res);
  }

  async create(item: LearningLanguage): Promise<void> {
    await this.prisma.learningLanguages.create({
      data: {
        id: item.id,
        Profile: {
          connect: {
            id: item.profile.id,
          },
        },
        LanguageCode: {
          connect: {
            id: item.language.id,
          },
        },
        level: item.level,
      },
    });
  }

  async getLearningLanguagesOfProfileSpeakingAndNotInActiveTandemFromUniversities(
    spokenLanguageId: string,
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
          AND: [
            {
              OR: [
                {
                  native_language_code_id: {
                    equals: spokenLanguageId,
                  },
                },
                {
                  MasteredLanguages: {
                    some: {
                      language_code_id: {
                        equals: spokenLanguageId,
                      },
                    },
                  },
                },
              ],
              User: {
                organization_id: {
                  in: universityIds,
                },
              },
            },
          ],
        },
        OR: [
          {
            Tandem: {
              is: null,
            },
          },
          {
            Tandem: {
              status: {
                not: {
                  equals: TandemStatus.ACTIVE,
                },
              },
            },
          },
        ],
      },
      include: LearningLanguageRelations,
    });

    return res.map(learningLanguageMapper);
  }

  async getLearningLanguagesOfUniversitiesNotInActiveTandem(
    universityIds: string[],
  ) {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
          User: {
            organization_id: {
              in: universityIds,
            },
          },
        },
        OR: [
          {
            Tandem: {
              is: null,
            },
          },
          {
            Tandem: {
              status: {
                not: {
                  equals: TandemStatus.ACTIVE,
                },
              },
            },
          },
        ],
      },
      include: LearningLanguageRelations,
    });

    return res.map(learningLanguageMapper);
  }

  async hasAnActiveTandem(id: string): Promise<boolean> {
    const res = await this.prisma.learningLanguages.findFirst({
      where: {
        id: {
          equals: id,
        },
        Tandem: {
          status: {
            equals: TandemStatus.ACTIVE,
          },
        },
      },
    });

    return !!res;
  }

  async getLearningLanguagesOfOtherProfileFromUniversitiesNotInActiveTandem(
    profileId: string,
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
          AND: [
            {
              id: {
                not: {
                  equals: profileId,
                },
              },
            },
            {
              User: {
                organization_id: {
                  in: universityIds,
                },
              },
            },
          ],
        },
        OR: [
          {
            Tandem: {
              is: null,
            },
          },
          {
            Tandem: {
              status: {
                not: {
                  equals: TandemStatus.ACTIVE,
                },
              },
            },
          },
        ],
      },
      include: LearningLanguageRelations,
    });

    return res.map(learningLanguageMapper);
  }

  async OfUniversities({
    page,
    limit,
    universityIds,
  }: LearningLanguageRepositoryGetProps): Promise<
    Collection<LearningLanguageWithTandem>
  > {
    const wherePayload = {
      Profile: {
        User: {
          organization_id: {
            in: universityIds,
          },
        },
      },
    };

    const count = await this.prisma.learningLanguages.count({
      where: wherePayload,
    });

    const items = await this.prisma.learningLanguages.findMany({
      where: wherePayload,
      skip: (page - 1) * limit,
      take: limit,
      include: LearningLanguageWithTandemRelations,
    });

    return {
      items: items.map(learningLanguageWithTandemMapper),
      totalItems: count,
    };
  }
}
