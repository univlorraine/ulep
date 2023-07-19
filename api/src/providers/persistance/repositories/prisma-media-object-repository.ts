import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MediaObjectRepository } from '../../../core/ports/media-object.repository';
import MediaObject from '../../../core/models/media-object';
import { User } from 'src/core/models/user';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async of(id: string): Promise<MediaObject | null> {
    const result = await this.prisma.mediaObject.findUnique({ where: { id } });

    if (!result) {
      return null;
    }

    return new MediaObject({
      id: result.id,
      name: result.name,
      bucket: result.bucket,
      mimetype: result.mime,
      size: result.size,
    });
  }

  async saveAvatar(user: User, object: MediaObject): Promise<void> {
    await this.prisma.mediaObject.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async delete(instance: MediaObject): Promise<void> {
    await this.prisma.mediaObject.delete({ where: { id: instance.id } });
  }
}
