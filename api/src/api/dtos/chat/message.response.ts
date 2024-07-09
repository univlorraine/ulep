import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserChatResponse } from 'src/api/dtos/chat/user-conversation.response';
import { MessageWithUser } from 'src/core/ports/chat.service';

export class MessageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['chat'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  content: string;

  @Swagger.ApiProperty({ type: UserChatResponse })
  @Expose({ groups: ['chat'] })
  user: UserChatResponse;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['chat'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  type: string;

  constructor(partial: Partial<MessageResponse>) {
    Object.assign(this, partial);
  }

  static from(message: MessageWithUser): MessageResponse {
    return new MessageResponse({
      id: message.id,
      createdAt: message.createdAt,
      content: message.content,
      user: UserChatResponse.fromDomain(message.user),
      type: message.type,
    });
  }
}
