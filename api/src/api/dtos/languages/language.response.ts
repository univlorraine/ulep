import { ApiProperty } from '@nestjs/swagger';
import { Language } from '../../../core/models/language';
import { Expose } from 'class-transformer';

export class LanguageResponse {
  @ApiProperty({ readOnly: true })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  name: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  enabled: boolean;

  constructor(partial: Partial<LanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(language: Language): LanguageResponse {
    return new LanguageResponse({
      id: language.id,
      code: language.code,
      name: language.name,
      enabled: language.isEnable,
    });
  }
}
