import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class CreateMultipleConversationsCommand {
    participants: string[][];
}

@Injectable()
export class CreateMultipleConversationsUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: CreateMultipleConversationsCommand) {
        await this.conversationRepository.createConversations(
            command.participants,
        );
    }
}
