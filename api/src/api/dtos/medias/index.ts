import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaObject } from 'src/core/models';

export const MEDIA_READ = 'media:read';

export class MediaObjectResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  mimeType: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'url' })
  @Expose({ groups: [MEDIA_READ] })
  url?: string;

  @Swagger.ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @Expose({ groups: [MEDIA_READ] })
  expireAt?: Date;

  constructor(partial: Partial<MediaObjectResponse>) {
    Object.assign(this, partial);
  }

  static fromMediaObject(instance: MediaObject): MediaObjectResponse {
    return new MediaObjectResponse({
      id: instance.id,
      mimeType: instance.mimetype,
    });
  }
}
