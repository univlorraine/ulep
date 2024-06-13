import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaObject } from 'src/core/models/media.model';
import { Message, MessageType } from 'src/core/models/message.model';

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

    constructor(partial: Partial<MessageResponse>) {
        Object.assign(this, partial);
    }

    static from(message: Message, media?: MediaObject): MessageResponse {
        return new MessageResponse({
            id: message.id,
            createdAt: message.createdAt,
            content: media ? media.id : message.content,
            ownerId: message.ownerId,
            type: message.type,
        });
    }
}
