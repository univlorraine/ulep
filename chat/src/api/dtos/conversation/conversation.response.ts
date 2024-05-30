import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MessageResponse } from 'src/api/dtos/message';
import { Conversation } from 'src/core/models';

export class ConversationResponse {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    @Expose({ groups: ['read'] })
    id: string;

    @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
    @Expose({ groups: ['read'] })
    createdAt: Date;

    @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
    @Expose({ groups: ['read'] })
    usersIds: string[];

    @Swagger.ApiProperty({ type: MessageResponse })
    @Expose({ groups: ['read'] })
    lastMessage?: MessageResponse;

    @Swagger.ApiProperty({ type: 'object' })
    @Expose({ groups: ['read'] })
    metadata: any;

    constructor(partial: Partial<ConversationResponse>) {
        Object.assign(this, partial);
    }

    static from(conversation: Conversation): ConversationResponse {
        return new ConversationResponse({
            id: conversation.id,
            createdAt: conversation.createdAt,
            usersIds: conversation.usersIds,
            metadata: conversation.metadata,
            lastMessage: conversation.lastMessage
                ? MessageResponse.from(conversation.lastMessage)
                : undefined,
        });
    }
}
