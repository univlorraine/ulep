import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UploadResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  url: string;

  constructor(partial: Partial<UploadResponse>) {
    Object.assign(this, partial);
  }
}
