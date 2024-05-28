import { Conversation } from 'src/core/models';

export const CONVERSATION_REPOSITORY = 'conversation.repository';

export interface ConversationRepository {
    create: (userIds: string[], metadata: any) => Promise<Conversation>;
    delete: (conversationId: string) => Promise<void>;
    update: (
        conversationId: string,
        userIds: string[],
        metadata: any,
    ) => Promise<Conversation>;
}
