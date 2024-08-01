import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserChatResponse } from 'src/api/dtos/chat/user-conversation.response';
import { MessageWithUser } from 'src/core/ports/chat.service';

class OGImageResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  url: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  type: string;

  constructor(partial: Partial<OGImageResponse>) {
    Object.assign(this, partial);
  }

  static from(ogImage: any): OGImageResponse {
    return new OGImageResponse({
      url: ogImage.url,
      type: ogImage.type,
    });
  }
}
class OGResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  ogSiteName?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  ogUrl?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  ogLocale?: string;

  @Swagger.ApiProperty({ type: 'array' })
  @Expose({ groups: ['chat'] })
  ogImage?: OGImageResponse[];

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  ogTitle?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  ogDescription?: string;

  constructor(partial: Partial<OGResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any): OGResponse {
    return new OGResponse({
      ogSiteName: metadata.ogSiteName,
      ogUrl: metadata.ogUrl,
      ogLocale: metadata.ogLocale,
      ogImage:
        metadata.ogImage && metadata.ogImage.length > 0
          ? metadata.ogImage.map(OGImageResponse.from)
          : [],
      ogTitle: metadata.ogTitle,
      ogDescription: metadata.ogDescription,
    });
  }
}
class MetadataMessageResponse {
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  originalFilename?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['chat'] })
  openGraphResult?: OGResponse;

  constructor(partial: Partial<MetadataMessageResponse>) {
    Object.assign(this, partial);
  }

  static from(metadata: any): MetadataMessageResponse {
    return new MetadataMessageResponse({
      originalFilename: metadata.originalFilename,
      openGraphResult: metadata.openGraphResult
        ? OGResponse.from(metadata.openGraphResult)
        : undefined,
    });
  }
}

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

  @Swagger.ApiProperty({ type: 'object' })
  @Expose({ groups: ['chat'] })
  metadata: MetadataMessageResponse;

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
      metadata: MetadataMessageResponse.from(message.metadata),
    });
  }
}
