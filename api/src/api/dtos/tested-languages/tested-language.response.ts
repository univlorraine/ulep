import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TestedLanguage } from 'src/core/models/tested-language.model';

export class TestedLanguageResponse {
  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({ type: 'string', example: 'A1' })
  @Expose({ groups: ['read'] })
  level: string;

  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<TestedLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(testedLanguage: TestedLanguage): TestedLanguageResponse {
    return new TestedLanguageResponse({
      code: testedLanguage.language.code,
      level: testedLanguage.level,
      name: testedLanguage.language.name,
    });
  }
}
