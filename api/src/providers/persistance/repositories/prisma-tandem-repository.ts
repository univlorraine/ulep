import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { FindWhereProps } from '../../../core/ports/tandems.repository';
import { Tandem, TandemStatus } from '../../../core/models';
import { TandemRelations, tandemMapper } from '../mappers/tandem.mapper';
import { HistorizedTandem } from 'src/core/models/historized-tandem.model';
import {
  HistorizedTandemRelation,
  historizedTandemMapper,
} from '../mappers/historizedTandem.mapper';

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
          purge_id: purgeId,
          tandem_id: tandem.id,
          language_code_id: learningLanguage.language.id,
        })),
      });
    }
  }

  async getHistorizedTandemForUser(
    userId: string,
  ): Promise<HistorizedTandem[]> {
    const res = await this.prisma.tandemHistory.findMany({
      where: {
        user_id: userId,
      },
      // include: HistorizedTandemRelation,
    });
    return res.map(historizedTandemMapper);
  }
}
