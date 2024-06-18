import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { Conversation } from 'src/core/models';
import {
    ConversationRelations,
    conversationMapper,
} from 'src/providers/persistance/mappers';
import { ConversationRepository } from 'src/core/ports/conversation.repository';

@Injectable()
export class PrismaConversationRepository implements ConversationRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findById(conversationId: string): Promise<Conversation> {
        const conversation = await this.prisma.conversation.findUnique({
            where: { id: conversationId },
            ...ConversationRelations,
        });

        if (!conversation) {
            return null;
        }

        return conversationMapper(conversation);
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const conversations = await this.prisma.conversation.findMany({
            where: { participantIds: { has: userId } },
            ...ConversationRelations,
            include: {
                Messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        return conversations.map(conversationMapper);
    }

    async create(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = await this.prisma.conversation.create({
            data: {
                id,
                participantIds: usersIds,
                metadata: metadata,
            },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }

    async createConversations(participants: string[][]): Promise<void> {
        await this.prisma.conversation.createMany({
            data: participants.map((participantIds) => ({
                participantIds,
            })),
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.conversation.delete({ where: { id } });
    }

    async deleteUserFromConversations(userId: string): Promise<void> {
        await this.prisma.conversation.deleteMany({
            where: { participantIds: { has: userId } },
        });
    }

    async deleteAll(): Promise<void> {
        await this.prisma.conversation.deleteMany();
    }

    async update(
        id: string,
        usersIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = await this.prisma.conversation.update({
            where: { id },
            data: { participantIds: usersIds, metadata },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }
}
