import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LanguageRequestsCountResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  count: number;

  constructor(partial: Partial<LanguageRequestsCountResponse>) {
    Object.assign(this, partial);
  }
}
