import { Collection } from '@app/common';
import {
  ChatPaginationDirection,
  ChatServicePort,
  Conversation,
  CreateConversations,
  Message,
} from 'src/core/ports/chat.service';

export class InMemoryChatService implements ChatServicePort {
  createConversations(conversations: CreateConversations[]): Promise<any> {
    return;
  }
  getAllConversationsFromUserId(
    userId: string,
    limit: number,
    offset: number,
    filteredProfilesIds?: string[],
  ): Promise<Collection<Conversation>> {
    return;
  }
  getMessagesFromConversationId(
    conversationId: string,
    limit: number,
    lastMessageId?: string,
    contentFilter?: string,
    typeFilter?: string,
    direction?: ChatPaginationDirection,
  ): Promise<Collection<Message>> {
    return;
  }
  deleteConversation(tandemId: string): Promise<any> {
    return;
  }
  async createConversation(
    users: string[],
    tandemId?: string,
    metadata: any = {},
  ): Promise<any> {
    return;
  }
}
