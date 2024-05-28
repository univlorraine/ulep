import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { MessageRepository } from 'src/core/ports/message.repository';
import { Message } from 'src/core/models';
import { MessagesRelations, messageMapper } from 'src/providers/mappers';

@Injectable()
export class PrismaMessageRepository implements MessageRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(message: Message): Promise<Message> {
        const messageSent = await this.prisma.message.create({
            data: {
                id: message.id,
                content: message.content,
                isReported: message.isReported,
                type: message.type,
                Conversation: { connect: { id: message.conversationId } },
                Owner: {
                    create: {
                        id: message.owner.id,
                        name: message.owner.name,
                        image: message.owner.image,
                    },
                },
            },
            ...MessagesRelations,
        });

        return messageMapper(messageSent);
    }
}
