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

import { Collection, PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Tandem, TandemStatus } from '../../../core/models';
import {
  FindWhereProps,
  TandemRepository,
} from '../../../core/ports/tandem.repository';
import { tandemMapper, TandemRelations } from '../mappers/tandem.mapper';

@Injectable()
export class PrismaTandemRepository implements TandemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private static toPrismaModel(tandem: Tandem) {
    return {
      id: tandem.id,
      LearningLanguages: {
        connect: tandem.learningLanguages.map((learningLanguage) => ({
          id: learningLanguage.id,
        })),
      },
      status: tandem.status,
      learning_type: tandem.learningType,
      UniversityValidations: {
        connect: tandem.universityValidations?.map((universityId) => ({
          id: universityId,
        })),
      },
      compatibilityScore: Math.floor(tandem.compatibilityScore * 100),
    };
  }

  async save(tandem: Tandem): Promise<void> {
    await this.prisma.tandems.create({
      data: PrismaTandemRepository.toPrismaModel(tandem),
    });

    for (const learningLanguage of tandem.learningLanguages) {
      if (learningLanguage.tandemLanguage) {
        await this.prisma.learningLanguages.update({
          where: {
            id: learningLanguage.id,
          },
          data: {
            TandemLanguage: {
              connect: {
                id: learningLanguage.tandemLanguage.id,
              },
            },
          },
        });
      }
    }
  }

  async saveMany(tandems: Tandem[]): Promise<void> {
    const { tandemsToCreate, learningLanguagesToUpdate } = tandems.reduce(
      (accumulator, value) => {
        accumulator.tandemsToCreate.push(
          this.prisma.tandems.create({
            data: PrismaTandemRepository.toPrismaModel(value),
          }),
        );
        for (const learningLanguage of value.learningLanguages) {
          if (learningLanguage.tandemLanguage) {
            accumulator.learningLanguagesToUpdate.push(
              this.prisma.learningLanguages.update({
                where: {
                  id: learningLanguage.id,
                },
                data: {
                  TandemLanguage: {
                    connect: {
                      id: learningLanguage.tandemLanguage.id,
                    },
                  },
                },
              }),
            );
          }
        }

        return accumulator;
      },
      {
        tandemsToCreate: [],
        learningLanguagesToUpdate: [],
      },
    );

    await this.prisma.$transaction(
      tandemsToCreate.concat(learningLanguagesToUpdate),
    );
  }

  async findWhere(props: FindWhereProps): Promise<Collection<Tandem>> {
    const count = await this.prisma.tandems.count({
      where: {
        status: props.status ? { equals: props.status } : undefined,
      },
    });

    if (props.offset && props.offset >= count) {
      return { items: [], totalItems: count };
    }

    const tandems = await this.prisma.tandems.findMany({
      where: {
        status: props.status ? { equals: props.status } : undefined,
      },
      skip: props.offset,
      take: props.limit,
      include: TandemRelations,
    });

    return {
      items: tandems.map(tandemMapper),
      totalItems: count,
    };
  }

  async getExistingTandems(): Promise<Tandem[]> {
    const tandems = await this.prisma.tandems.findMany({
      where: {
        status: { not: 'INACTIVE' },
      },
      include: TandemRelations,
    });
    return tandems.map(tandemMapper);
  }

  async getTandemsForProfile(profileId: string): Promise<Tandem[]> {
    const tandems = await this.prisma.tandems.findMany({
      where: {
        LearningLanguages: {
          some: {
            Profile: {
              id: {
                equals: profileId,
              },
            },
          },
        },
      },
      include: TandemRelations,
    });
    return tandems.map(tandemMapper);
  }

  async getTandemForLearningLanguage(
    learningLanguageId: string,
  ): Promise<Tandem> {
    const tandem = await this.prisma.tandems.findFirst({
      where: {
        LearningLanguages: {
          some: {
            id: {
              equals: learningLanguageId,
            },
          },
        },
      },
      include: TandemRelations,
    });

    if (!tandem) {
      return null;
    }

    return tandemMapper(tandem);
  }

  async getTandemOfLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<Tandem> {
    const tandem = await this.prisma.tandems.findFirst({
      where: {
        LearningLanguages: {
          every: {
            id: {
              in: learningLanguageIds,
            },
          },
        },
      },
      include: TandemRelations,
    });

    if (!tandem) {
      return null;
    }

    return tandemMapper(tandem);
  }

  async deleteTandemNotLinkedToLearningLangues(): Promise<number> {
    const tandems = await this.prisma.tandems.findMany({
      include: {
        LearningLanguages: true,
      },
    });

    const tandemsToDelete = tandems.filter(
      (tandem) => tandem.LearningLanguages.length !== 2,
    );

    const idsToDelete = tandemsToDelete.map((tandem) => tandem.id);

    const deleteResult = await this.prisma.tandems.deleteMany({
      where: {
        id: {
          in: idsToDelete,
        },
      },
    });

    return deleteResult.count;
  }

  async disableTandemsForUser(id: string): Promise<void> {
    await this.prisma.tandems.updateMany({
      where: {
        LearningLanguages: {
          some: {
            Profile: {
              user_id: {
                equals: id,
              },
            },
          },
        },
      },
      data: {
        status: TandemStatus.INACTIVE,
      },
    });
  }

  async deleteTandemLinkedToLearningLanguages(
    learningLanguageIds: string[],
  ): Promise<number> {
    const res = await this.prisma.tandems.deleteMany({
      where: {
        LearningLanguages: {
          some: {
            id: {
              in: learningLanguageIds,
            },
          },
        },
      },
    });

    return res.count;
  }

  async ofId(id: string): Promise<Tandem> {
    const res = await this.prisma.tandems.findFirst({
      where: {
        id,
      },
      include: TandemRelations,
    });

    if (!res) {
      return null;
    }

    return tandemMapper(res);
  }

  async ofIds(ids: string[]): Promise<Tandem[]> {
    const tandems = await this.prisma.tandems.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: TandemRelations,
    });

    return tandems.map(tandemMapper);
  }

  async update(tandem: Tandem): Promise<void> {
    await this.prisma.tandems.update({
      where: {
        id: tandem.id,
      },
      data: PrismaTandemRepository.toPrismaModel(tandem),
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tandems.delete({
      where: {
        id,
      },
    });
  }

  async deleteAll(): Promise<void> {
    await this.prisma.tandems.deleteMany();
  }

  async archiveTandems(tandems: Tandem[], purgeId: string): Promise<void> {
    for (const tandem of tandems) {
      await this.prisma.tandemHistory.createMany({
        data: tandem.learningLanguages.map((learningLanguage) => ({
          id: learningLanguage.id,
          user_id: learningLanguage.profile.user.id,
          user_email: learningLanguage.profile.user.email,
          purge_id: purgeId,
          tandem_id: tandem.id,
          language_code_id: learningLanguage.language.id,
        })),
      });
    }
  }
}
