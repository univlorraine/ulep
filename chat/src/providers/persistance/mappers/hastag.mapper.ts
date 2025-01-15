import { Prisma } from '@prisma/client';
import { Hashtag } from 'src/core/models';

const HashtagInclude = Prisma.validator<Prisma.HashtagInclude>()({
    Conversation: true,
});

export const HashtagRelations = { include: HashtagInclude };

export type HashtagSnapshot = Prisma.HashtagGetPayload<typeof HashtagRelations>;

export const hashtagMapper = (name: string, count: number): Hashtag => {
    return new Hashtag({
        name,
        numberOfUses: count,
    });
};
