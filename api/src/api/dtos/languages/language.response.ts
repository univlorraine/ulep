import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../../core/models/language';
import { Expose } from 'class-transformer';

export class LanguageResponse {
  @ApiProperty({
    type: 'string',
    description: 'ISO 639-1 code',
    example: 'FR',
  })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({
    type: 'string',
    description: 'Language name',
    example: 'French',
  })
  @Expose({ groups: ['read'] })
  name: string;

  @ApiProperty({
    type: 'boolean',
    description: 'Language availability',
    example: true,
  })
  @Expose({ groups: ['read'] })
  enabled: boolean;

  constructor(partial: Partial<LanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(language: Language): LanguageResponse {
    return new LanguageResponse({
      code: language.code,
      name: language.name,
      enabled: language.isEnable,
    });
  }
}
