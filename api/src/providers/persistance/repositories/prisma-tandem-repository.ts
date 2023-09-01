import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { FindWhereProps } from '../../../core/ports/tandems.repository';
import { Tandem, TandemStatus } from '../../../core/models';
import {
  LearningLanguageRelations,
  learningLanguageMapper,
} from '../mappers/learningLanguage.mapper';

@Injectable()
export class PrismaTandemRepository implements TandemRepository {
  constructor(private readonly prisma: PrismaService) {}

  // TODO(NOW+1): tandem.mapper

  // TODO(NOW+1): globally check if need to split relations and condition mappers
  // Regarding methods / UC

  async save(tandem: Tandem): Promise<void> {
    await this.prisma.tandems.create({
      data: {
        id: tandem.id,
        LearningLanguages: {
          connect: tandem.learningLanguages.map((learningLanguage) => ({
            id: learningLanguage.id,
          })),
        },
        status: tandem.status,
      },
    });
  }

  async saveMany(tandems: Tandem[]): Promise<void> {
    const tandemsToCreate = tandems.map((tandem) =>
      this.prisma.tandems.create({
        data: {
          id: tandem.id,
          LearningLanguages: {
            connect: tandem.learningLanguages.map((learningLanguage) => ({
              id: learningLanguage.id,
            })),
          },
          status: tandem.status,
        },
      }),
    );

    await this.prisma.$transaction(tandemsToCreate);
  }

  async findWhere(props: FindWhereProps): Promise<Collection<Tandem>> {
    const count = await this.prisma.tandems.count({
      where: {
        status: props.status ? { equals: props.status } : undefined,
      },
    });

    if (props.offset >= count) {
      return { items: [], totalItems: count };
    }

    const tandems = await this.prisma.tandems.findMany({
      where: {
        status: props.status ? { equals: props.status } : undefined,
      },
      skip: props.offset,
      take: props.limit,
      include: {
        LearningLanguages: {
          include: LearningLanguageRelations,
        },
      },
    });

    return {
      items: tandems.map((tandem) => {
        return new Tandem({
          id: tandem.id,
          learningLanguages: tandem.LearningLanguages.map(
            learningLanguageMapper,
          ),
          status: TandemStatus[tandem.status],
        });
      }),
      totalItems: count,
    };
  }

  async delete(tandemId: string): Promise<void> {
    await this.prisma.tandems.delete({
      where: { id: tandemId },
    });
  }

  async getExistingTandems(): Promise<Tandem[]> {
    const tandems = await this.prisma.tandems.findMany({
      where: {
        status: { not: 'INACTIVE' },
      },
      include: {
        LearningLanguages: {
          include: LearningLanguageRelations,
        },
      },
    });
    // TODO: optimize with an object TandemSummary which would not including profile relations
    return tandems.map((tandem) => {
      return new Tandem({
        id: tandem.id,
        learningLanguages: tandem.LearningLanguages.map(learningLanguageMapper),
        status: TandemStatus[tandem.status],
      });
    });
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
      include: {
        LearningLanguages: {
          include: LearningLanguageRelations,
        },
      },
    });

    return tandems.map(
      (tandem) =>
        new Tandem({
          id: tandem.id,
          learningLanguages: tandem.LearningLanguages.map(
            learningLanguageMapper,
          ),
          status: TandemStatus[tandem.status],
        }),
    );
  }
}
