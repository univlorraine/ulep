import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MediaObject } from 'src/core/models';

export class MediaObjectResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  url: string;

  constructor(partial: Partial<MediaObjectResponse>) {
    Object.assign(this, partial);
  }

  static fromMediaObject(mediaObject: MediaObject): MediaObjectResponse {
    return new MediaObjectResponse({
      id: mediaObject.id,
      url: mediaObject.url,
    });
  }
}
