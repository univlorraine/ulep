import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Hashtag } from 'src/core/models';
import { HashtagRepository } from 'src/core/ports/hastag.repository';
import { hashtagMapper } from 'src/providers/persistance/mappers/hastag.mapper';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class PrismaHashtagRepository implements HashtagRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(conversationId: string, name: string): Promise<void> {
        await this.prisma.hashtag.create({
            data: { Conversation: { connect: { id: conversationId } }, name },
        });
    }

    async findAllByConversationId(conversationId: string): Promise<Hashtag[]> {
        const todayStart = startOfDay(new Date());
        const todayEnd = endOfDay(new Date());

        const hashtags = await this.prisma.hashtag.findMany({
            where: {
                Conversation: { id: conversationId },
                created_at: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
            select: { name: true },
        });

        const hashtagCount = hashtags.reduce((acc, { name }) => {
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Trier les hashtags par fréquence et prendre les 10 premiers
        const topHashtags = Object.entries(hashtagCount)
            .sort(([, countA], [, countB]) => countB - countA)
            .slice(0, 10)
            .map(([name, count]) => hashtagMapper(name, count));

        return topHashtags;
    }
}
