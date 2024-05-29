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

        return conversationMapper(conversation);
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const conversations = await this.prisma.conversation.findMany({
            where: { participantIds: { has: userId } },
            ...ConversationRelations,
        });

        return conversations.map(conversationMapper);
    }

    async create(userIds: string[], metadata: any): Promise<Conversation> {
        const conversation = await this.prisma.conversation.create({
            data: {
                participantIds: userIds,
                metadata: metadata,
            },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }

    async delete(id: string): Promise<void> {
        await this.prisma.conversation.delete({ where: { id } });
    }

    async update(
        id: string,
        userIds: string[],
        metadata: any,
    ): Promise<Conversation> {
        const conversation = await this.prisma.conversation.update({
            where: { id },
            data: { participantIds: userIds, metadata },
            ...ConversationRelations,
        });

        return conversationMapper(conversation);
    }
}
