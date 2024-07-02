import { Conversation } from 'src/core/models';

export const CONVERSATION_REPOSITORY = 'conversation.repository';

export interface CreateConversations {
    participants: string[];
    tandemId?: string;
}

export interface ConversationRepository {
    create: (
        id: string,
        usersIds: string[],
        metadata: any,
    ) => Promise<Conversation>;
    createConversations: (
        conversations: CreateConversations[],
    ) => Promise<void>;
    delete: (conversationId: string) => Promise<void>;
    deleteUserFromConversations: (userId: string) => Promise<void>;
    deleteAll: () => Promise<void>;
    findById: (conversationId: string) => Promise<Conversation | undefined>;
    findByUserId: (userId: string) => Promise<Conversation[]>;
    findConversationsByIdsOrParticipants: (
        ids: string[],
        participants: string[][],
    ) => Promise<Conversation[]>;
    update: (
        conversationId: string,
        usersIds: string[],
        metadata: any,
    ) => Promise<Conversation>;
}
