import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MessageResponse } from 'src/api/dtos/chat/message.response';
import { UserChatResponse } from 'src/api/dtos/chat/user-conversation.response';
import { LanguageResponse } from 'src/api/dtos/languages';
import { LearningLanguageResponse } from 'src/api/dtos/learning-languages';
import { UserResponse } from 'src/api/dtos/users';
import { ConversationWithUsers } from 'src/core/ports/chat.service';

class MetadataResponse {
  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['chat'] })
  isBlocked: boolean;

  @Swagger.ApiProperty({ type: LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['chat'] })
  learningLanguages: LearningLanguageResponse[];

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['chat'] })
  centralLanguage: LanguageResponse;

  @Swagger.ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['chat'] })
  partnerLanguage: LanguageResponse;

  constructor(partial: Partial<MetadataResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any): MetadataResponse {
    return new MetadataResponse({
      isBlocked: metadata.isBlocked,
      learningLanguages: metadata.learningLanguages?.map((learningLanguage) =>
        LearningLanguageResponse.fromDomain(learningLanguage),
      ),
      centralLanguage: metadata.centralLanguage
        ? LanguageResponse.fromLanguage(metadata.centralLanguage)
        : undefined,
      partnerLanguage: metadata.partnerLanguage
        ? LanguageResponse.fromLanguage(metadata.partnerLanguage)
        : undefined,
    });
  }
}

export class ConversationResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['chat'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['chat'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['chat'] })
  lastActivityAt: Date;

  @Swagger.ApiProperty({ type: UserResponse, isArray: true })
  @Expose({ groups: ['chat'] })
  users: UserChatResponse[];

  @Swagger.ApiProperty({ type: MessageResponse })
  @Expose({ groups: ['chat'] })
  lastMessage?: MessageResponse;

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['chat'] })
  isForCommunity: boolean;

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['chat'] })
  metadata: MetadataResponse;

  constructor(partial: Partial<ConversationResponse>) {
    Object.assign(this, partial);
  }

  static from(
    conversation: ConversationWithUsers,
    userId: string,
  ): ConversationResponse {
    return new ConversationResponse({
      id: conversation.id,
      createdAt: conversation.createdAt,
      lastActivityAt: conversation.lastActivityAt,
      isForCommunity: conversation.isForCommunity,
      users: conversation.users.map(UserChatResponse.fromDomain),
      metadata: MetadataResponse.from(conversation.metadata),
      lastMessage: conversation.lastMessage
        ? MessageResponse.from(conversation.lastMessage, userId)
        : undefined,
    });
  }
}
