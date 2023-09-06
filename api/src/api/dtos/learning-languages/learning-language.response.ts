import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileResponse } from '../profiles';
import { LearningLanguage } from 'src/core/models';

export class LearningLanguageResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  name?: string;

  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code?: string;

  @ApiProperty({ type: 'string', example: 'A1' })
  @Expose({ groups: ['read'] })
  level: string;

  @ApiProperty({ type: ProfileResponse })
  @Expose({ groups: ['read'] })
  profile: ProfileResponse;

  constructor(partial: Partial<LearningLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguage,
    includeProfile = false,
  ): LearningLanguageResponse {
    if (includeProfile) {
      return new LearningLanguageResponse({
        id: learningLanguage.id,
        name: learningLanguage.language.name,
        code: learningLanguage.language.code,
        level: learningLanguage.level,
        profile: ProfileResponse.fromDomain(learningLanguage.profile),
      });
    }

    return new LearningLanguageResponse({
      id: learningLanguage.id,
      name: learningLanguage.language.name,
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}
