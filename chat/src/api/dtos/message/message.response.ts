import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Message, MessageType } from 'src/core/models/message.model';

class OGImageResponse {
    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    url: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    type: string;

    constructor(partial: Partial<OGImageResponse>) {
        Object.assign(this, partial);
    }

    static from(ogImage: any): OGImageResponse {
        return new OGImageResponse({
            url: ogImage.url,
            type: ogImage.type,
        });
    }
}
class OGResponse {
    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    ogSiteName?: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    ogUrl?: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    ogLocale?: string;

    @Swagger.ApiProperty({ type: 'array' })
    @Expose({ groups: ['read'] })
    ogImage?: OGImageResponse[];

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    ogTitle?: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    ogDescription?: string;

    constructor(partial: Partial<OGResponse>) {
        Object.assign(this, partial);
    }

    static from(metadata: any): OGResponse {
        return new OGResponse({
            ogSiteName: metadata.ogSiteName,
            ogUrl: metadata.ogUrl,
            ogLocale: metadata.ogLocale,
            ogImage:
                metadata.ogImage && metadata.ogImage.length > 0
                    ? metadata.ogImage.map(OGImageResponse.from)
                    : [],
            ogTitle: metadata.ogTitle,
            ogDescription: metadata.ogDescription,
        });
    }
}
class MetadataMessageResponse {
    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    originalFilename?: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    openGraphResult?: any;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    thumbnail?: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    filePath?: string;

    constructor(partial: Partial<MetadataMessageResponse>) {
        Object.assign(this, partial);
    }

    static from(metadata: any): MetadataMessageResponse {
        return new MetadataMessageResponse({
            originalFilename: metadata.originalFilename,
            openGraphResult: metadata.openGraphResult
                ? OGResponse.from(metadata.openGraphResult)
                : undefined,
            thumbnail: metadata.thumbnail,
            filePath: metadata.filePath,
        });
    }
}

export class MessageResponse {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @Expose({ groups: ['read'] })
    id: string;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    content: string;

    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @Expose({ groups: ['read'] })
    ownerId: string;

    @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
    @Expose({ groups: ['read'] })
    createdAt: Date;

    @Swagger.ApiProperty({ type: 'string' })
    @Expose({ groups: ['read'] })
    type: MessageType;

    @Swagger.ApiProperty({ type: 'array' })
    @Expose({ groups: ['read'] })
    likes: string[];

    @Swagger.ApiProperty({ type: 'object' })
    @Expose({ groups: ['read'] })
    metadata: MetadataMessageResponse;

    constructor(partial: Partial<MessageResponse>) {
        Object.assign(this, partial);
    }

    static from(message: Message): MessageResponse {
        return new MessageResponse({
            id: message.id,
            createdAt: message.createdAt,
            content: message.content,
            ownerId: message.ownerId,
            type: message.type,
            metadata: MetadataMessageResponse.from(message.metadata),
            likes: message.usersLiked?.map((like) => like.userId) || [],
        });
    }
}
