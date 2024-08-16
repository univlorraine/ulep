import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class DeleteContactConversationCommand {
    id: string;
}

@Injectable()
export class DeleteContactConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteContactConversationCommand) {
        const conversations = await this.conversationRepository.findByUserId(
            command.id,
        );

        conversations.items.forEach(async (conversation) => {
            if (conversation.usersIds.length === 2) {
                await this.conversationRepository.delete(conversation.id);
            } else {
                await this.conversationRepository.update(
                    conversation.id,
                    conversation.usersIds.filter(
                        (userId) => userId !== command.id,
                    ),
                    conversation.metadata,
                );
            }
        });
    }
}
