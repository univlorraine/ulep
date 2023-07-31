import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';
import { MediaObject, User } from 'src/core/models';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveAvatar(user: User, object: MediaObject): Promise<void> {
    await this.prisma.mediaObjects.create({
      data: {
        id: object.id,
        name: object.name,
        bucket: object.bucket,
        mime: object.mimetype,
        size: object.size,
        User: {
          connect: {
            id: user.id,
          },
        },
      },
    });
  }

  async findAll(): Promise<MediaObject[]> {
    const instances = await this.prisma.mediaObjects.findMany();

    return instances.map(
      (mediaObject) =>
        new MediaObject({
          id: mediaObject.id,
          name: mediaObject.name,
          bucket: mediaObject.bucket,
          mimetype: mediaObject.mime,
          size: mediaObject.size,
        }),
    );
  }

  async findOne(id: string): Promise<MediaObject | null> {
    const result = await this.prisma.mediaObjects.findUnique({ where: { id } });

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

  async remove(id: string): Promise<void> {
    await this.prisma.mediaObjects.delete({ where: { id } });
  }
}
