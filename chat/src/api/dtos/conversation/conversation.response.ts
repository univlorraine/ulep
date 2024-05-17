import * as Swagger from '@nestjs/swagger';
import { MessageResponse } from 'src/api/dtos/message';
import { Conversation } from 'src/core/models';

export class ConversationResponse {
    @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
    id: string;

    @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
    createdAt: Date;

    @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
    usersIds: string[];

    @Swagger.ApiProperty({ type: MessageResponse })
    lastMessage?: MessageResponse;

    @Swagger.ApiProperty({ type: 'object' })
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
            lastMessage: conversation.lastMessage,
        });
    }
}
