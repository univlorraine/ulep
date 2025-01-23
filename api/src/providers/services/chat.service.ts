import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Env } from 'src/configuration';
import {
  ChatPaginationDirection,
  ChatServicePort,
  CreateConversations,
} from 'src/core/ports/chat.service';

@Injectable()
export class ChatService implements ChatServicePort {
  private headers = {
    'Content-Type': 'application/json',
  };
  private readonly logger = new Logger(ChatService.name);
  constructor(private readonly env: ConfigService<Env, true>) {}

  async createConversation(
    users: string[],
    tandemId?: string,
    metadata: any = {},
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.post(
        this.env.get('CHAT_URL') + '/conversations',
        {
          userIds: users,
          tandemId,
          metadata,
        },
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while creating conversation', { error });
    }
  }

  async createConversations(
    conversations: CreateConversations[],
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.post(
        this.env.get('CHAT_URL') + '/conversations/multi',
        {
          conversations,
        },
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while creating conversation', { error });
    }
  }

  async getAllConversationsFromUserId(
    userId: string,
    limit: number,
    offset: number,
    filteredProfilesIds?: string[],
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    let params = new URLSearchParams();
    if (filteredProfilesIds) {
      filteredProfilesIds.forEach((id) => {
        params.append('filteredProfilesIds[]', id);
      });
    }

    try {
      const response = await axios.get(
        `${this.env.get(
          'CHAT_URL',
        )}/conversations/${userId}?limit=${limit}&offset=${offset}${
          filteredProfilesIds ? `&${params.toString()}` : ''
        }`,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while getting all conversations', { error });

      if (error.response.status === 431) {
        throw new BadRequestException(
          'Too many filtered users, please narrow down your search',
        );
      }

      throw error;
    }
  }

  async getMessagesFromConversationId(
    conversationId: string,
    limit: number,
    lastMessageId?: string,
    hashtagFilter?: string,
    typeFilter?: string,
    direction?: ChatPaginationDirection,
    parentId?: string,
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.get(
        `${this.env.get(
          'CHAT_URL',
        )}/conversations/messages/${conversationId}?limit=${limit}${
          lastMessageId ? `&lastMessageId=${lastMessageId}` : ''
        }${hashtagFilter ? `&hashtagFilter=${hashtagFilter}` : ''}${
          typeFilter ? `&typeFilter=${typeFilter}` : ''
        }${direction ? `&direction=${direction}` : ''}${
          parentId ? `&parentId=${parentId}` : ''
        }`,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while getting messages from conversation', {
        error,
      });
    }
  }

  async deleteConversation(tandemId: string): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.delete(
        this.env.get('CHAT_URL') + '/conversations/' + tandemId,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting conversation', { error });
    }
  }

  async deleteConversationByUserId(
    userId: string,
    chatIdsToIgnore?: string[],
    chatIdsToLeave?: string[],
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.post(
        this.env.get('CHAT_URL') + '/conversations/user/' + userId,
        {
          chatIdsToIgnore: chatIdsToIgnore || [],
          chatIdsToLeave: chatIdsToLeave || [],
        },
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting conversation', { error });
    }
  }

  async deleteAllConversations(): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.delete(
        this.env.get('CHAT_URL') + '/purge/',
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting conversation', { error });
    }
  }

  async deleteMessage(messageId: string, shouldDelete: boolean): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.put(
        this.env.get('CHAT_URL') + '/messages/' + messageId,
        { isDeleted: shouldDelete },
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting message', { error });
    }
  }

  async addUserToConversation(
    conversationId: string,
    userId: string,
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.post(
        this.env.get('CHAT_URL') +
          '/conversations/' +
          conversationId +
          '/add-user',
        { userId },
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while adding user to conversation', { error });
    }
  }
}
