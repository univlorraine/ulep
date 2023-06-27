import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TokensResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  accessToken: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  refreshToken: string;

  constructor(partial: Partial<TokensResponse>) {
    Object.assign(this, partial);
  }
}
