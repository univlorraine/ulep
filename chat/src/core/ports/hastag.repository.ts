import { Hashtag } from 'src/core/models';

export const HASHTAG_REPOSITORY = 'hashtag.repository';

export interface HashtagRepository {
    create: (conversationId: string, name: string) => Promise<void>;
    findAllByConversationId: (conversationId: string) => Promise<Hashtag[]>;
}
