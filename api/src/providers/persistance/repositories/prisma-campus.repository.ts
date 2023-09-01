import { Injectable, Logger } from '@nestjs/common';
import { Collection, PrismaService } from '@app/common';
import { CampusRepository } from 'src/core/ports/campus.repository';
import { Campus } from 'src/core/models/campus.model';
import { campusMapper } from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaCampusRepository implements CampusRepository {
  constructor(private readonly prisma: PrismaService) {}
  async all(): Promise<Collection<Campus>> {
    const count = await this.prisma.places.count({});
    const campus = await this.prisma.places.findMany({});

    return new Collection<Campus>({
      items: campus.map(campusMapper),
      totalItems: count,
    });
  }

  async ofId(id: string): Promise<Campus> {
    const campus = await this.prisma.places.findUnique({ where: { id } });

    if (!campus) {
      return null;
    }

    return campusMapper(campus);
  }

  async create(campus: Campus): Promise<Campus> {
    const newCampus = await this.prisma.places.create({
      data: {
        id: campus.id,
        name: campus.name,
        Organization: { connect: { id: campus.universityId } },
      },
    });

    return campusMapper(newCampus);
  }

  async update(campus: Campus): Promise<Campus> {
    await this.prisma.places.update({
      where: {
        id: campus.id,
      },
      data: {
        name: campus.name,
        Organization: { connect: { id: campus.universityId } },
      },
    });

    const updatedCampus = await this.prisma.places.findUnique({
      where: { id: campus.id },
    });

    return campusMapper(updatedCampus);
  }
  async delete(id: string): Promise<void> {
    const campus = await this.ofId(id);

    if (!campus) {
      return;
    }

    await this.prisma.places.delete({ where: { id } });
  }

  private readonly logger = new Logger(PrismaCampusRepository.name);
}
