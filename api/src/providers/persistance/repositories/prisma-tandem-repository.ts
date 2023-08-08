import { Injectable } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { TandemRepository } from '../../../core/ports/tandems.repository';
import { FindWhereProps } from '../../../core/ports/tandems.repository';
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
          status: { equals: TandemStatus.ACTIVE },
        },
      },
    });

    return activeTandems.length > 0;
  }

  async findWhere(props: FindWhereProps): Promise<Collection<Tandem>> {
    const count = await this.prisma.tandems.count({
      where: {
        status: props.status ? { equals: props.status } : undefined,
        Profiles: props.profileId
          ? { some: { profile_id: props.profileId } }
          : undefined,
      },
    });

    if (props.offset >= count) {
      return { items: [], totalItems: count };
    }

    const tandems = await this.prisma.tandems.findMany({
      where: {
        status: props.status ? { equals: props.status } : undefined,
        Profiles: props.profileId
          ? { some: { profile_id: props.profileId } }
          : undefined,
      },
      skip: props.offset,
      take: props.limit,
      include: {
        Profiles: { include: { Profile: { include: ProfilesRelations } } },
      },
    });

    return {
      items: tandems.map((tandem) => {
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
