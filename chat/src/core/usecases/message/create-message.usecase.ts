import { Inject, NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
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
const openGraphScraper = require('open-graph-scraper');

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

interface CreateMessageCommand {
    content: string;
    conversationId: string;
    ownerId: string;
    originalFilename?: string;
    mimetype?: string;
    filePath?: string;
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

        let openGraphResult: any;
        const url = command.content
            ? command.content.match(URL_REGEX)?.[0]
            : undefined;
        if (url) {
            try {
                const result = await openGraphScraper({ url });
                if (result.result.success) {
                    openGraphResult = result.result;
                }
            } catch (err) {
                console.warn('Url not found for open graph', url);
            }
        }

        const message = new Message({
            id: this.uuidProvider.generate(),
            content: command.content,
            ownerId: command.ownerId,
            conversationId: command.conversationId,
            usersLiked: [],
            type: openGraphResult
                ? MessageType.Link
                : await Message.categorizeFileType(command.mimetype),
            isReported: false,
            isDeleted: false,
            metadata: {
                filePath: command.filePath,
                originalFilename: command.originalFilename,
                openGraphResult: openGraphResult,
            },
        });

        const createdMessage = await this.messageRepository.create(message);

        await this.conversationRepository.updateLastActivityAt(conversation.id);

        this.notificationService.sendNotification(
            message.ownerId,
            conversation.usersIds.filter((id) => id !== message.ownerId),
            message.content,
        );

        return createdMessage;
    }
}
