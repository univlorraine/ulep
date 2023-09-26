import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { RefusedTandem } from 'src/core/models';
import { RefusedTandemsRepository } from 'src/core/ports/refused-tandems.repository';

@Injectable()
export class PrismaRefusedTandemsRepository
  implements RefusedTandemsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async save(item: RefusedTandem): Promise<void> {
    await this.prisma.refusedTandems.create({
      data: {
        id: item.id,
        University: {
          connect: {
            id: item.universityId,
          },
        },
        LearningLanguages: {
          connect: item.learningLanguageIds.map((id) => ({
            id,
          })),
        },
      },
    });
  }

  async getAll(): Promise<RefusedTandem[]> {
    const res = await this.prisma.refusedTandems.findMany({
      include: {
        University: true,
        LearningLanguages: true,
      },
    });

    return res.map(
      (item) =>
        new RefusedTandem({
          id: item.id,
          learningLanguageIds: item.LearningLanguages.map((ll) => ll.id),
          universityId: item.University.id,
        }),
    );
  }

  async getForLearningLanguage(
    learningLanguageId: string,
  ): Promise<RefusedTandem[]> {
    const res = await this.prisma.refusedTandems.findMany({
      where: {
        LearningLanguages: {
          some: {
            id: {
              equals: learningLanguageId,
            },
          },
        },
      },
      include: {
        University: true,
        LearningLanguages: true,
      },
    });

    return res.map(
      (item) =>
        new RefusedTandem({
          id: item.id,
          learningLanguageIds: item.LearningLanguages.map((ll) => ll.id),
          universityId: item.University.id,
        }),
    );
  }
}
