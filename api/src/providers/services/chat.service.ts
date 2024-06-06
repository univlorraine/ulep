import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import { ChatServicePort } from 'src/core/ports/chat.service';
import { ConfigService } from '@nestjs/config';
import { Env } from 'src/configuration';

@Injectable()
export class ChatService implements ChatServicePort {
  private headers = {
    'Content-Type': 'application/json',
  };
  private readonly logger = new Logger(ChatService.name);
  constructor(private readonly env: ConfigService<Env, true>) {}

  async createConversation(
    tandemId: string,
    users: string[],
    metadata: any = {},
  ): Promise<any> {
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
      this.logger.error('Error while creating conversation', error);
      throw new Error('HTTP request failed');
    }
  }

  async deleteConversation(tandemId: string): Promise<any> {
    try {
      const response = await axios.delete(
        this.env.get('CHAT_URL') + '/conversations/' + tandemId,
        { headers: this.headers },
      );

      return response.data;
    } catch (error) {
      this.logger.error('Error while deleting conversation', error);
      throw new Error('HTTP request failed');
    }
  }
}
