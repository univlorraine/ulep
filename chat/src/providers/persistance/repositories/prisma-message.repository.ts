import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Message } from 'src/core/models';
import {
    MessagePagination,
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

    async findMessagesByConversationId(
        conversationId: string,
        pagination: MessagePagination,
        filter?: string,
    ): Promise<Message[]> {
        const messagesPagination = {};
        const where = { conversationId };

        if (pagination.limit !== undefined) {
            messagesPagination['take'] = pagination.limit;
        }

        if (pagination.lastMessageId) {
            const lastMessage = await this.prisma.message.findFirst({
                where: {
                    id: pagination.lastMessageId,
                },
            });

            if (lastMessage) {
                where['createdAt'] = {
                    lt: lastMessage.createdAt,
                };
            } else {
                return [];
            }
        }

        if (filter) {
            where['content'] = {
                contains: filter,
            };
        }

        const messages = await this.prisma.message.findMany({
            where,
            orderBy: { updatedAt: 'desc' },
            ...messagesPagination,
            ...MessagesRelations,
        });

        return messages.map(messageMapper);
    }
}
