import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { FindWhereProps } from '../../../core/ports/tandems.repository';
import { Tandem } from '../../../core/models';
import { TandemRelations, tandemMapper } from '../mappers/tandem.mapper';

@Injectable()
export class PrismaTandemRepository implements TandemRepository {
  constructor(private readonly prisma: PrismaService) {}

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
      include: TandemRelations,
    });

    return {
      items: tandems.map(tandemMapper),
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

  async deleteTandemNotLinkedToLearningLangues(): Promise<number> {
    const res = await this.prisma.tandems.deleteMany({
      where: {
        LearningLanguages: {
          none: {},
        },
      },
    });

    return res.count;
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
}
