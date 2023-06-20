import { ApiProperty } from '@nestjs/swagger';
import { Language } from 'src/core/models/language';

export class LanguageResponse {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  enabled: boolean;

  static fromDomain(language: Language): LanguageResponse {
    return {
      id: language.id,
      code: language.code,
      name: language.name,
      enabled: language.isEnable,
    };
  }
}
