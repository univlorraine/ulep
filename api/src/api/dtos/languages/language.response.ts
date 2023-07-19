import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../../core/models/language';
import { Expose } from 'class-transformer';

export class LanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({ type: 'string', example: 'French' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<LanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(language: Language): LanguageResponse {
    return new LanguageResponse({
      code: language.code,
      name: language.name,
    });
  }
}
