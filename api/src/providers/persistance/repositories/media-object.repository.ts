import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';
import MediaObject from 'src/core/models/media-object';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<MediaObject | null> {
    const result = await this.prisma.media.findUnique({ where: { id } });

    if (!result) {
      return null;
    }

    return new MediaObject(
      result.id,
      result.name,
      result.bucket,
      result.mime,
      result.size,
    );
  }

  async save(instance: MediaObject): Promise<void> {
    await this.prisma.media.create({
      data: {
        id: instance.getId(),
        name: instance.getName(),
        bucket: instance.getBucket(),
        mime: instance.getMimetype(),
        size: instance.getSize(),
      },
    });
  }

  async delete(instance: MediaObject): Promise<void> {
    await this.prisma.media.delete({ where: { id: instance.getId() } });
  }
}
