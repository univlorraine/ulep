import { Inject, Injectable } from '@nestjs/common';
import { RessourceAlreadyExists } from 'src/core/errors';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';

export class CreateConversationCommand {
    tandemId: string;
    userIds: string[];
    metadata: any;
}

@Injectable()
export class CreateConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
    ) {}

    async execute(command: CreateConversationCommand) {
        const doesConversationExist =
            await this.conversationRepository.findById(command.tandemId);

        if (doesConversationExist) {
            throw new RessourceAlreadyExists(
                'Conversation with id: ' + command.tandemId + ' already exists',
            );
        }

        const conversation = await this.conversationRepository.create(
            command.tandemId,
            command.userIds,
            command.metadata,
        );

        return conversation;
    }
}
