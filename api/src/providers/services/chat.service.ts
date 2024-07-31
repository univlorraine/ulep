import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Env } from 'src/configuration';
import { ChatServicePort } from 'src/core/ports/chat.service';

export interface CreateConversations {
  participants: string[];
  tandemId?: string;
}

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
  ): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.get(
        `${this.env.get(
          'CHAT_URL',
        )}/conversations/${userId}?limit=${limit}&offset=${offset}`,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while getting all conversations', { error });
    }
  }

  async getMessagesFromConversationId(
    conversationId: string,
    limit: number,
    lastMessageId?: string,
    contentFilter?: string,
    typeFilter?: string,
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
        }${contentFilter ? `&contentFilter=${contentFilter}` : ''}${
          typeFilter ? `&typeFilter=${typeFilter}` : ''
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

  async deleteConversationByContactId(contactId: string): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.delete(
        this.env.get('CHAT_URL') + '/conversations/contact/' + contactId,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting conversation', { error });
    }
  }

  async deleteConversationByUserId(userId: string): Promise<any> {
    if (!this.env.get('CHAT_URL')) {
      return;
    }

    try {
      const response = await axios.delete(
        this.env.get('CHAT_URL') + '/conversations/user/' + userId,
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
}
