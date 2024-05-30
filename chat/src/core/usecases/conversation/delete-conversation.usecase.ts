import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class DeleteConversationCommand {
    id: string;
}

@Injectable()
export class DeleteConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: DeleteConversationCommand) {
        await this.conversationRepository.delete(command.id);
    }
}
