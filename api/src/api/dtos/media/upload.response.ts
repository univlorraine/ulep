import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  url: string;

  constructor(partial: Partial<UploadResponse>) {
    Object.assign(this, partial);
  }
}
