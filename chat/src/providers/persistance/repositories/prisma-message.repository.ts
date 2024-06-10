import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import {
    MessageFilters,
    MessageRepository,
} from 'src/core/ports/message.repository';
import { Message } from 'src/core/models';
import {
    MessagesRelations,
    messageMapper,
} from 'src/providers/persistance/mappers';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(message: Message): Promise<Message> {
        let owner = await this.prisma.owner.findUnique({
            where: { id: message.owner.id },
        });

        if (owner) {
            owner = await this.prisma.owner.update({
                where: { id: message.owner.id },
                data: {
                    name: message.owner.name,
                    image: message.owner.image,
                },
            });
        } else {
            owner = await this.prisma.owner.create({
                data: {
                    id: message.owner.id,
                    name: message.owner.name,
                    image: message.owner.image,
                },
            });
        }

        const messageSent = await this.prisma.message.create({
            data: {
                content: message.content,
                isReported: message.isReported,
                type: message.type,
                Conversation: { connect: { id: message.conversationId } },
                Owner: { connect: { id: message.owner.id } },
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
        filters: MessageFilters,
    ): Promise<Message[]> {
        const filter = {};

        if (filters.limit !== undefined) {
            filter['take'] = filters.limit;
        }

        if (filters.offset !== undefined) {
            filter['skip'] = filters.offset;
        }

        const messages = await this.prisma.message.findMany({
            where: { conversationId },
            ...filter,
            orderBy: { updatedAt: 'desc' },
            ...MessagesRelations,
        });

        return messages.map(messageMapper);
    }
}
