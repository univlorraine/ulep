import { Inject, NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import { Owner } from 'src/core/models/owner.model';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessageRepository,
} from 'src/core/ports/message.repository';
import { UUID_PROVIDER } from 'src/core/ports/uuid.provider';
import { UuidProvider } from 'src/providers/services/uuid.provider';

interface CreateMessageCommand {
    content: string;
    conversationId: string;
    ownerId: string;
    ownerName: string;
    ownerImage: string;
    mimetype?: string;
}

export class CreateMessageUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(UUID_PROVIDER)
        private readonly uuidProvider: UuidProvider,
    ) {}

    async execute(command: CreateMessageCommand) {
        const conversation = await this.conversationRepository.findById(
            command.conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        const message = new Message({
            id: this.uuidProvider.generate(),
            content: command.content,
            owner: new Owner({
                id: command.ownerId,
                name: command.ownerName,
                image: command.ownerImage,
            }),
            conversationId: command.conversationId,
            type: this.categorizeFileType(command.mimetype),
            isReported: false,
        });

        await this.messageRepository.create(message);

        return message;
    }

    private categorizeFileType(mimeType?: string): MessageType {
        if (!mimeType) {
            return 'text';
        } else if (mimeType.startsWith('audio/')) {
            return 'audio';
        } else if (mimeType.startsWith('image/')) {
            return 'image';
        } else {
            return 'file';
        }
    }
}
