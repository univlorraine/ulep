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
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  TandemStatus,
  UserStatus,
} from 'src/core/models';
import { HistorizedUnmatchedLearningLanguage } from 'src/core/models/historized-unmatched-learning-language';
import {
  LearningLanguageQuerySortKey,
  LearningLanguageRepository,
  LearningLanguageRepositoryGetProps,
} from 'src/core/ports/learning-language.repository';
import {
  historizedUnmatchedLearningLanguageMapper,
  HistorizedUnmatchedLearningLanguageRelation,
} from 'src/providers/persistance/mappers/historizedUnmatchedLearningLanguage.mapper';
import {
  learningLanguageMapper,
  LearningLanguageRelations,
  learningLanguageWithTandemMapper,
  LearningLanguageWithTandemRelations,
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

  async ofProfile(id: string): Promise<LearningLanguage[]> {
    const items = await this.prisma.learningLanguages.findMany({
      where: {
        profile_id: id,
      },
      include: LearningLanguageWithTandemRelations,
    });

    return items.map(learningLanguageWithTandemMapper);
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
        same_tandem_email: item.sameTandemEmail,
        has_priority: item.hasPriority,
        certificate_option: item.certificateOption,
        specific_program: item.specificProgram,
        Campus: item.campus && {
          connect: { id: item.campus.id },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.learningLanguages.delete({ where: { id } });
  }

  async update(item: LearningLanguage): Promise<void> {
    await this.prisma.learningLanguages.update({
      where: { id: item.id },
      data: {
        level: item.level,
        learning_type: item.learningType,
        same_gender: item.sameGender,
        same_age: item.sameAge,
        has_priority: item.hasPriority,
        certificate_option: item.certificateOption,
        learning_journal: item.learningJournal,
        consulting_interview: item.consultingInterview,
        shared_certificate: item.sharedCertificate,
        specific_program: item.specificProgram,
        shared_logs_date: item.sharedLogsDate ?? null,
        visio_duration: item.visioDuration,
      },
    });
  }

  async getAvailableLearningLanguagesSpeakingLanguageFromUniversities(
    languageId: string,
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
                    equals: languageId,
                  },
                },
                {
                  MasteredLanguages: {
                    some: {
                      language_code_id: {
                        equals: languageId,
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
                      notIn: [UserStatus.BANNED, UserStatus.CANCELED],
                    },
                  },
                ],
              },
            },
          ],
        },
        OR: [
          {
            Tandem: null,
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

  async getAvailableLearningLanguagesOfUniversities(universityIds: string[]) {
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
                  notIn: [UserStatus.BANNED, UserStatus.CANCELED],
                },
              },
            ],
          },
        },
        OR: [
          {
            Tandem: null,
          },
          {
            Tandem: {
              status: {
                not: {
                  in: [
                    TandemStatus.ACTIVE,
                    TandemStatus.VALIDATED_BY_ONE_UNIVERSITY,
                  ],
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

  async getAvailableLearningLanguagesSpeakingOneOfLanguagesAndFromUniversities(
    allowedLanguages: string[],
    universityIds: string[],
  ): Promise<LearningLanguage[]> {
    const res = await this.prisma.learningLanguages.findMany({
      where: {
        Profile: {
          AND: [
            {
              // Assert target speaks an allowed language
              OR: [
                {
                  native_language_code_id: {
                    in: allowedLanguages,
                  },
                },
                {
                  MasteredLanguages: {
                    some: {
                      language_code_id: {
                        in: allowedLanguages,
                      },
                    },
                  },
                },
              ],
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
                      notIn: [UserStatus.BANNED, UserStatus.CANCELED],
                    },
                  },
                ],
              },
            },
          ],
        },
        OR: [
          {
            Tandem: null,
          },
          {
            Tandem: {
              status: {
                not: {
                  in: [
                    TandemStatus.ACTIVE,
                    TandemStatus.VALIDATED_BY_ONE_UNIVERSITY,
                  ],
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
    hasPausedTandem,
    lastname,
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
                notIn: [UserStatus.BANNED, UserStatus.CANCELED],
              },
            },
            {
              lastname: {
                contains: lastname || '',
                mode: ModeQuery.INSENSITIVE,
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
            Tandem: null,
          },
        ],
      });
    }

    if (hasPausedTandem === true) {
      tandemWhereClauses.push({
        Tandem: {
          status: {
            equals: TandemStatus.PAUSED,
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
            Tandem: null,
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
            Tandem: null,
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
                lastname: orderBy.order,
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
        case LearningLanguageQuerySortKey.SPECIFIC_PROGRAM:
          orderByPayload = {
            specific_program: orderBy.order,
          };
          break;
        case LearningLanguageQuerySortKey.ROLE:
          orderByPayload = {
            Profile: {
              User: {
                role: orderBy.order,
              },
            },
          };
          break;
        default:
          throw new Error('Unsupported orderBy field');
      }
    }

    let pagination = { skip: undefined, take: undefined };
    if (page && limit) {
      pagination = { skip: (page - 1) * limit, take: limit };
    }

    const items = await this.prisma.learningLanguages.findMany({
      where: wherePayload,
      ...pagination,
      include: LearningLanguageWithTandemRelations,
      orderBy: orderByPayload,
    });

    return {
      items: items.map(learningLanguageWithTandemMapper),
      totalItems: count,
    };
  }

  async getUnmatchedLearningLanguages() {
    const learningLanguages = await this.prisma.learningLanguages.findMany({
      where: {
        Tandem: null,
      },
      include: LearningLanguageRelations,
    });

    return learningLanguages.map(learningLanguageMapper);
  }

  async archiveUnmatchedLearningLanguages(
    learningLanguages: LearningLanguage[],
    purgeId: string,
  ) {
    await this.prisma.unmatchedLearningLanguages.deleteMany({});

    await this.prisma.unmatchedLearningLanguages.createMany({
      data: learningLanguages.map((l) => ({
        id: l.id,
        user_id: l.profile.user.id,
        purge_id: purgeId,
        language_code_id: l.language.id,
      })),
    });
  }

  async getHistoricUnmatchedLearningLanguageByUserIdAndLanguageId(
    userId: string,
    languageId: string,
  ): Promise<HistorizedUnmatchedLearningLanguage> {
    const res = await this.prisma.unmatchedLearningLanguages.findFirst({
      where: { language_code_id: languageId, user_id: userId },
      include: HistorizedUnmatchedLearningLanguageRelation,
    });

    if (!res) {
      return undefined;
    }

    return historizedUnmatchedLearningLanguageMapper(res);
  }
}
