import { Inject, Injectable } from '@nestjs/common';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class GetConversationFromUserIdCommand {
    id: string;
}

@Injectable()
export class GetConversationFromUserIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: GetConversationFromUserIdCommand) {
        const conversation = await this.conversationRepository.findByUserId(
            command.id,
        );

        return conversation;
    }
}
