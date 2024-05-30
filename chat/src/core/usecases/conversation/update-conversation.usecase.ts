import { Inject, Injectable } from '@nestjs/common';
import { MEDIA_OBJECT_REPOSITORY } from '../../ports/media-object.repository';
import { ConversationRepository } from 'src/core/ports/conversation.repository';

export class UpdateConversationCommand {
    id: string;
    userIds: string[];
    metadata: any;
}

@Injectable()
export class UpdateConversationUsecase {
    constructor(
        @Inject(MEDIA_OBJECT_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: UpdateConversationCommand) {
        const conversation = await this.conversationRepository.update(
            command.id,
            command.userIds,
            command.metadata,
        );

        return conversation;
    }
}
