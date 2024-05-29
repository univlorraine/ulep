import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { MediaObjectRepository } from 'src/core/ports/media-object.repository';
import { MediaObject } from 'src/core/models/media.model';
import { Message } from 'src/core/models';

@Injectable()
export class PrismaMediaObjectRepository implements MediaObjectRepository {
    constructor(private readonly prisma: PrismaService) {}

    async saveFile(object: MediaObject, message: Message): Promise<void> {
        await this.prisma.mediaObject.create({
            data: {
                id: object.id,
                name: object.name,
                bucket: object.bucket,
                mime: object.mimetype,
                size: object.size,
                Message: { connect: { id: message.id } },
            },
        });
    }

    async findOne(id: string): Promise<MediaObject | null> {
        const result = await this.prisma.mediaObject.findUnique({
            where: { id },
        });

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
        await this.prisma.mediaObject.delete({ where: { id } });
    }
}
