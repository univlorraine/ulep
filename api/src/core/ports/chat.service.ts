import { Collection } from '@app/common';
import { User } from 'src/core/models';

export const CHAT_SERVICE = 'chat.service';

export type Conversation = {
  id: string;
  createdAt: Date;
  usersIds: string[];
  lastActivity: Date;
  lastMessage?: Message;
  metadata: any;
};

export type ConversationWithUsers = {
  id: string;
  createdAt: Date;
  users: User[];
  lastActivity: Date;
  lastMessage?: MessageWithUser;
  metadata: any;
};

export interface Message {
  id: string;
  content: string;
  createdAt: Date;
  ownerId: string;
  type: string;
}

export interface MessageWithUser {
  id: string;
  content: string;
  createdAt: Date;
  user: User;
  type: string;
}

//TODO: Change any to a proper type
export interface ChatServicePort {
  getAllConversationsFromUserId(
    userId: string,
    limit: number,
    offset: number,
  ): Promise<Collection<Conversation>>;
  getMessagesFromConversationId(
    conversationId: string,
    limit: number,
    lastMessageId?: string,
    messageFilter?: string,
  ): Promise<Collection<Message>>;
  createConversation(
    users: string[],
    tandemId?: string,
    metadata?: any,
  ): Promise<any>;
  deleteConversation(tandemId: string): Promise<any>;
}
