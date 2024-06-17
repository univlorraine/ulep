import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class DeleteUserConversationCommand {
    id: string;
}

@Injectable()
export class DeleteUserConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteUserConversationCommand) {
        await this.conversationRepository.deleteUserFromConversations(
            command.id,
        );
    }
}
