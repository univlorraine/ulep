import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import {
    CONVERSATION_REPOSITORY,
    ConversationRepository,
} from 'src/core/ports/conversation.repository';
import {
    MESSAGE_REPOSITORY,
    MessagePagination,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    STORAGE_INTERFACE,
    StorageInterface,
} from 'src/core/ports/storage.interface';

export class GetMessagesFromConversationIdCommand {
    id: string;
    pagination: MessagePagination;
    hashtagFilter: string;
    typeFilter: MessageType;
    parentId?: string;
}

@Injectable()
export class GetMessagesFromConversationIdUsecase {
    constructor(
        @Inject(CONVERSATION_REPOSITORY)
        private readonly conversationRepository: ConversationRepository,
        @Inject(MESSAGE_REPOSITORY)
        private readonly messageRepository: MessageRepository,
        @Inject(STORAGE_INTERFACE)
        private readonly storage: StorageInterface,
    ) {}

    async execute(command: GetMessagesFromConversationIdCommand) {
        const conversation = await this.conversationRepository.findById(
            command.id,
        );

        if (!conversation) {
            throw new NotFoundException('Conversation not found');
        }

        let messages: Message[];

        if (!command.parentId) {
            messages =
                await this.messageRepository.findMessagesByConversationId(
                    command.id,
                    command.pagination,
                    command.hashtagFilter,
                    command.typeFilter,
                );
        } else {
            messages = await this.messageRepository.findResponsesByMessageId(
                command.parentId,
                command.pagination,
            );
        }

        for (const message of messages) {
            if (
                (message.type === MessageType.Image ||
                    message.type === MessageType.Audio ||
                    message.type === MessageType.File) &&
                message.content
            ) {
                message.metadata.filePath = message.content;
                message.content = await this.storage.temporaryUrl(
                    'chat',
                    message.content,
                    3600,
                );

                if (
                    message.type === MessageType.Image &&
                    message.metadata.thumbnail
                ) {
                    message.metadata.thumbnail =
                        await this.storage.temporaryUrl(
                            'chat',
                            message.metadata.thumbnail,
                            3600,
                        );
                }
            }
        }

        return messages;
    }
}
