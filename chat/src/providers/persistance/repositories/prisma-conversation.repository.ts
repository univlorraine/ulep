import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Conversation } from 'src/core/models';
import {
    ConversationRepository,
    CreateConversations,
} from 'src/core/ports/conversation.repository';
import {
    ConversationRelations,
    conversationMapper,
} from 'src/providers/persistance/mappers';

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
            orderBy: {
                createdAt: 'desc',
            },
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

        conversations.sort((a, b) => {
            const lastMessageA = a.Messages[0]?.createdAt;
            const lastMessageB = b.Messages[0]?.createdAt;

            if (lastMessageA > lastMessageB) {
                return -1;
            } else if (lastMessageA < lastMessageB) {
                return 1;
            } else {
                return 0;
            }
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

    async findConversationsByIdsOrParticipants(
        ids: string[],
        participantsGroup: string[][],
    ): Promise<Conversation[]> {
        const existingConversations = await this.prisma.conversation.findMany({
            where: {
                OR: [
                    { id: { in: ids } },
                    ...participantsGroup.map((participants) => ({
                        OR: participants.map((participant) => ({
                            participantIds: { has: participant },
                        })),
                    })),
                ],
            },
            ...ConversationRelations,
        });

        if (!existingConversations) {
            return [];
        }

        return existingConversations.map(conversationMapper);
    }

    async createConversations(
        conversations: CreateConversations[],
    ): Promise<void> {
        await this.prisma.conversation.createMany({
            data: conversations.map((conversation) => ({
                participantIds: conversation.participants,
                id: conversation.tandemId,
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
