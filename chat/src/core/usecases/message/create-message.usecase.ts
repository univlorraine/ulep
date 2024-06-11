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
import {
    NOTIFICATION_SERVICE,
    NotificationServicePort,
} from 'src/core/ports/notification.service';
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
        @Inject(NOTIFICATION_SERVICE)
        private readonly notificationService: NotificationServicePort,
    ) {}

    async execute(command: CreateMessageCommand) {
        const conversation = await this.conversationRepository.findById(
            command.conversationId,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        if (!conversation.usersIds.includes(command.ownerId)) {
            throw new NotFoundException('User not found in conversation');
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
            type: Message.categorizeFileType(command.mimetype),
            isReported: false,
        });

        const createdMessage = await this.messageRepository.create(message);

        this.notificationService.sendNotification(
            message.owner.id,
            conversation.usersIds.filter((id) => id !== message.owner.id),
            message.content,
        );

        return createdMessage;
    }
}
