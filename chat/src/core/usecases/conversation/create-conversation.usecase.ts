import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_OBJECT_REPOSITORY } from '../../ports/media-object.repository';
import { ConversationRepository } from 'src/core/ports/conversation.repository';

export class CreateConversationCommand {
    userIds: string[];
    metadata: any;
}

@Injectable()
export class CreateConversationUsecase {
    constructor(
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: CreateConversationCommand) {
        const conversation = await this.conversationRepository.create(
            command.userIds,
            command.metadata,
        );

        return conversation;
    }
}
