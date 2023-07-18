import { Injectable } from '@nestjs/common';
import { TandemsRepository } from '../../../core/ports/tandems.repository';
import { Tandem } from '../../../core/models/tandem';
import { PrismaService } from '../prisma.service';
import { profileMapper } from '../mappers/profile.mapper';
import { Collection } from 'src/shared/types/collection';

@Injectable()
export class PrismaTandemRepository implements TandemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tandem: Tandem): Promise<void> {
    await this.prisma.tandem.create({
      data: {
        id: tandem.id,
        profiles: {
          create: tandem.profiles.map((profile) => ({
            profile: { connect: { id: profile.id } },
          })),
        },
        status: tandem.status,
      },
    });
  }

  async hasActiveTandem(profileId: string): Promise<boolean> {
    const activeTandems = await this.prisma.profilesOnTandems.findMany({
      where: {
        profileId: profileId,
        tandem: {
          status: { equals: 'active' },
        },
      },
    });

    return activeTandems.length > 0;
  }

  async findAllActiveTandems(
    offset?: number,
    limit?: number,
  ): Promise<Collection<Tandem>> {
    const count = await this.prisma.tandem.count({
      where: { status: { equals: 'active' } },
    });

    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const activeTandems = await this.prisma.tandem.findMany({
      where: { status: { equals: 'active' } },
      skip: offset,
      take: limit,
      include: {
        profiles: {
          include: {
            profile: {
              include: {
                user: true,
                university: { include: { country: true } },
                nationality: true,
                nativeLanguage: true,
                masteredLanguages: { include: { language: true } },
                learningLanguage: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return {
      items: activeTandems.map((tandem) => {
        return new Tandem({
          id: tandem.id,
          profiles: tandem.profiles.map((p) => profileMapper(p.profile)),
          status: tandem.status as 'active' | 'inactive',
        });
      }),
      totalItems: count,
    };
  }

  async delete(tandemId: string): Promise<void> {
    await this.prisma.tandem.delete({
      where: { id: tandemId },
    });
  }
}
