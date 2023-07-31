import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LanguageCodeResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<LanguageCodeResponse>) {
    Object.assign(this, partial);
  }
}

export class LanguageRequestsCountResponse {
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @Swagger.ApiProperty()
  @Expose({ groups: ['read'] })
  count: number;

  constructor(partial: Partial<LanguageRequestsCountResponse>) {
    Object.assign(this, partial);
  }
}
