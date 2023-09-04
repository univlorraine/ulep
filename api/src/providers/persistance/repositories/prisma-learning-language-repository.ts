import { LearningLanguage, TandemStatus } from 'src/core/models';
import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { LearningLanguageRepository } from 'src/core/ports/learning-language.repository';
import {
  LearningLanguageRelations,
  learningLanguageMapper,
} from '../mappers/learningLanguage.mapper';

// TODO(NOW+1): common where clause

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

  async getLearningLanguagesOfProfileSpeakingAndNotInActiveTandem(
    spokenLanguageId: string,
  ): Promise<LearningLanguage[]> {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
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

  async getLearningLanguagesOfOtherProfileNotInActiveTandem(
    profileId: string,
  ): Promise<LearningLanguage[]> {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
          id: {
            not: {
              equals: profileId,
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
}
