import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Message, MessageType } from 'src/core/models';
import {
    MessagePagination,
    MessagePaginationDirection,
    MessageRepository,
} from 'src/core/ports/message.repository';
import {
    MessagesRelations,
    messageMapper,
} from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(message: Message): Promise<Message> {
        const messageSent = await this.prisma.message.create({
            data: {
                content: message.content,
                isReported: message.isReported,
                type: message.type,
                ownerId: message.ownerId,
                metadata: message.metadata,
                Conversation: { connect: { id: message.conversationId } },
            },
            ...MessagesRelations,
        });

        return messageMapper(messageSent);
    }

    async like(id: string): Promise<Message> {
        const message = await this.prisma.message.update({
            where: { id },
            data: { likes: { increment: 1 } },
            ...MessagesRelations,
        });

        return messageMapper(message);
    }

    async unlike(id: string): Promise<Message> {
        const message = await this.prisma.message.update({
            where: { id },
            data: { likes: { decrement: 1 } },
            ...MessagesRelations,
        });

        return messageMapper(message);
    }

    async findById(id: string): Promise<Message | null> {
        const message = await this.prisma.message.findUnique({
            where: { id },
            ...MessagesRelations,
        });

        return message ? messageMapper(message) : null;
    }

    async update(message: Message): Promise<Message> {
        await this.prisma.message.update({
            where: { id: message.id },
            data: {
                content: message.content,
                isReported: message.isReported,
                type: message.type,
            },
            ...MessagesRelations,
        });

        const newMessage = await this.prisma.message.findUnique({
            where: { id: message.id },
            ...MessagesRelations,
        });

        return messageMapper(newMessage);
    }

    async searchMessagesIdByConversationId(
        conversationId: string,
        search: string,
    ): Promise<string[]> {
        const messagesIds = await this.prisma.message.findMany({
            where: {
                conversationId,
                content: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 300,
        });

        return messagesIds.map((message) => message.id);
    }

    async findMessagesByConversationId(
        conversationId: string,
        pagination: MessagePagination,
        contentFilter?: string,
        typeFilter?: MessageType,
    ): Promise<Message[]> {
        const messagesPagination = {};
        const where = { conversationId };
        const cursor = pagination.lastMessageId
            ? { id: pagination.lastMessageId }
            : undefined;

        if (pagination.limit !== undefined) {
            messagesPagination['take'] = pagination.limit;
        }

        if (contentFilter) {
            where['content'] = {
                contains: contentFilter,
            };
        }

        if (typeFilter) {
            where['type'] = typeFilter;
        }

        let messages = [];

        if (
            pagination.direction === MessagePaginationDirection.FORWARD ||
            pagination.direction === MessagePaginationDirection.BOTH
        ) {
            messages = await this.prisma.message.findMany({
                where,
                cursor,
                skip:
                    pagination.lastMessageId &&
                    pagination.direction === MessagePaginationDirection.FORWARD
                        ? 1
                        : 0,
                orderBy: { createdAt: 'desc' },
                ...messagesPagination,
                ...MessagesRelations,
            });
        }

        if (
            pagination.direction === MessagePaginationDirection.BACKWARD ||
            pagination.direction === MessagePaginationDirection.BOTH
        ) {
            messagesPagination['take'] = -pagination.limit;
            const reverseMessages = await this.prisma.message.findMany({
                where,
                cursor,
                skip: 1,
                orderBy: { createdAt: 'desc' },
                ...messagesPagination,
                ...MessagesRelations,
            });

            messages = [...reverseMessages, ...messages];
        }

        return messages.map(messageMapper);
    }
}
