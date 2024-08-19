import { Inject, Injectable } from '@nestjs/common';
import {
    DomainError,
    DomainErrorCode,
    RessourceAlreadyExists,
} from 'src/core/errors';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

export class CreateConversationCommand {
    userIds: string[];
    tandemId?: string;
    metadata: any;
}

@Injectable()
export class CreateConversationUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(UUID_PROVIDER)
        private readonly uuidProvider: UuidProvider,
    ) {}

    async execute(command: CreateConversationCommand) {
        const conversationId = command.tandemId || this.uuidProvider.generate();

        const doesConversationExist =
            await this.conversationRepository.findById(conversationId);

        if (doesConversationExist) {
            throw new RessourceAlreadyExists(
                'Conversation with id: ' + conversationId + ' already exists',
            );
        }

        const uniqueUserIds = new Set(command.userIds);
        if (uniqueUserIds.size !== command.userIds.length) {
            throw new DomainError({
                code: DomainErrorCode.BAD_REQUEST,
                message: 'Duplicate user IDs found in the command',
            });
        }

        const conversation = await this.conversationRepository.create(
            conversationId,
            command.userIds,
            command.metadata,
        );

        return conversation;
    }
}
