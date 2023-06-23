import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { MediaObjectRepository } from '../../../core/ports/media-object.repository';
import MediaObject from '../../../core/models/media-object';
import { Profile } from '../../../core/models/profile';

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

  async saveProfileImage(profile: Profile): Promise<void> {
    await this.prisma.mediaObject.create({
      data: {
        id: profile.avatar.id,
        name: profile.avatar.name,
        bucket: profile.avatar.bucket,
        mime: profile.avatar.mimetype,
        size: profile.avatar.size,
        profile: {
          connect: {
            id: profile.id,
          },
        },
      },
    });
  }

  async delete(instance: MediaObject): Promise<void> {
    await this.prisma.mediaObject.delete({ where: { id: instance.id } });
  }
}
