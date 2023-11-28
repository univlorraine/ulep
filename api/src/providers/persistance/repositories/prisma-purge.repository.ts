import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import Purge from 'src/core/models/purge.model';
import { PurgeRepository } from 'src/core/ports/purge.repository';
import { purgeMapper } from '../mappers/purge.mapper';

@Injectable()
export class PrismaPurgeRepository implements PurgeRepository {
  constructor(private readonly prisma: PrismaService) {}

  async all(): Promise<Purge[]> {
    const entries = await this.prisma.purges.findMany();

    return entries.map(purgeMapper);
  }

  async ofId(id: string): Promise<Purge> {
    const entry = await this.prisma.purges.findUnique({
      where: { id },
    });

    if (!entry) {
      throw new Error(`Purge with id ${id} does not exist`);
    }

    return purgeMapper(entry);
  }

  async create(id: string, author: string): Promise<Purge> {
    const instance = await this.prisma.purges.create({
      data: { id, author_id: author },
    });

    return purgeMapper(instance);
  }
}
