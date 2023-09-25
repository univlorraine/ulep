import {
  LearningLanguage,
  LearningLanguageWithTandem,
  TandemStatus,
  UserStatus,
} from 'src/core/models';
import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import {
  LearningLanguageQuerySortKey,
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
        learning_type: item.learningType,
        same_gender: item.sameGender,
        same_age: item.sameAge,
        certificate_option: item.certificateOption,
        specific_program: item.specificProgram,
        Campus: item.campus && {
          connect: { id: item.campus.id },
        },
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
                AND: [
                  {
                    organization_id: {
                      in: universityIds,
                    },
                  },
                  {
                    status: {
                      not: UserStatus.BANNED,
                    },
                  },
                ],
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
            AND: [
              {
                organization_id: {
                  in: universityIds,
                },
              },
              {
                status: {
                  not: UserStatus.BANNED,
                },
              },
            ],
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
                AND: [
                  {
                    organization_id: {
                      in: universityIds,
                    },
                  },
                  {
                    status: {
                      not: UserStatus.BANNED,
                    },
                  },
                ],
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
    orderBy,
    hasActiveTandem,
    hasActionableTandem,
  }: LearningLanguageRepositoryGetProps): Promise<
    Collection<LearningLanguageWithTandem>
  > {
    const permanentWherePayload = {
      Profile: {
        User: {
          AND: [
            {
              organization_id: {
                in: universityIds,
              },
            },
            {
              status: {
                not: UserStatus.BANNED,
              },
            },
          ],
        },
      },
    };

    const tandemWhereClauses = [];
    if (hasActionableTandem === true) {
      tandemWhereClauses.push({
        Tandem: {
          status: {
            not: {
              in: [TandemStatus.ACTIVE, TandemStatus.INACTIVE],
            },
          },
        },
      });
    } else if (hasActionableTandem === false) {
      tandemWhereClauses.push({
        OR: [
          {
            Tandem: {
              status: {
                in: [TandemStatus.ACTIVE, TandemStatus.INACTIVE],
              },
            },
          },
          {
            Tandem: {
              is: null,
            },
          },
        ],
      });
    }

    if (hasActiveTandem === true) {
      tandemWhereClauses.push({
        Tandem: {
          status: {
            equals: TandemStatus.ACTIVE,
          },
        },
      });
    } else if (hasActiveTandem === false) {
      tandemWhereClauses.push({
        OR: [
          {
            Tandem: {
              status: {
                not: {
                  equals: TandemStatus.ACTIVE,
                },
              },
            },
          },
          {
            Tandem: {
              is: null,
            },
          },
        ],
      });
    }

    let wherePayload: any = { ...permanentWherePayload };
    if (tandemWhereClauses.length > 1) {
      wherePayload = {
        ...wherePayload,
        AND: tandemWhereClauses,
      };
    } else if (tandemWhereClauses.length === 1) {
      wherePayload = {
        ...wherePayload,
        ...tandemWhereClauses[0],
      };
    }

    const count = await this.prisma.learningLanguages.count({
      where: wherePayload,
    });

    let orderByPayload;
    if (orderBy) {
      switch (orderBy.field) {
        case LearningLanguageQuerySortKey.PROFILE:
          orderByPayload = {
            Profile: {
              User: {
                firstname: orderBy.order,
              },
            },
          };
          break;
        case LearningLanguageQuerySortKey.CREATED_AT:
          orderByPayload = {
            created_at: orderBy.order,
          };
          break;
        case LearningLanguageQuerySortKey.UNIVERSITY:
          orderByPayload = {
            Profile: {
              User: {
                Organization: {
                  name: orderBy.order,
                },
              },
            },
          };
          break;
        case LearningLanguageQuerySortKey.LEVEL:
          orderByPayload = {
            level: orderBy.order,
          };
          break;
        case LearningLanguageQuerySortKey.LANGUAGE:
          orderByPayload = {
            LanguageCode: {
              name: orderBy.order,
            },
          };
          break;
        default:
          throw new Error('Unsupported orderBy field');
      }
    }

    const items = await this.prisma.learningLanguages.findMany({
      where: wherePayload,
      skip: (page - 1) * limit,
      take: limit,
      include: LearningLanguageWithTandemRelations,
      orderBy: orderByPayload,
    });

    return {
      items: items.map(learningLanguageWithTandemMapper),
      totalItems: count,
    };
  }
}
