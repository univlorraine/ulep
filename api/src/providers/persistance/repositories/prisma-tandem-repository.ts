import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { Tandem, TandemStatus } from '../../../core/models';
import { ProfilesRelations, profileMapper } from '../mappers';

@Injectable()
export class PrismaTandemRepository implements TandemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(tandem: Tandem): Promise<void> {
    await this.prisma.tandems.create({
      data: {
        id: tandem.id,
        Profiles: {
          create: tandem.profiles.map((profile) => ({
            Profile: { connect: { id: profile.id } },
          })),
        },
        status: tandem.status,
      },
    });
  }

  async hasActiveTandem(profileId: string): Promise<boolean> {
    const activeTandems = await this.prisma.profilesOnTandems.findMany({
      where: {
        profile_id: profileId,
        Tandem: {
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
    const count = await this.prisma.tandems.count({
      where: { status: { equals: 'active' } },
    });

    if (offset >= count) {
      return { items: [], totalItems: count };
    }

    const activeTandems = await this.prisma.tandems.findMany({
      where: { status: { equals: 'active' } },
      skip: offset,
      take: limit,
      include: {
        Profiles: {
          include: {
            Profile: {
              include: ProfilesRelations,
            },
          },
        },
      },
    });

    return {
      items: activeTandems.map((tandem) => {
        return new Tandem({
          id: tandem.id,
          profiles: tandem.Profiles.map((p) => profileMapper(p.Profile)),
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
}
