import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileResponse } from '../profiles';
import { LearningLanguage, LearningLanguageWithTandem } from 'src/core/models';
import { Optional } from '@nestjs/common';
import { TandemResponse } from '../tandems';

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

  @ApiProperty({ type: 'date' })
  @Optional()
  @Expose({ groups: ['read'] })
  createdAt?: Date;

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
        createdAt: learningLanguage.createdAt,
      });
    }

    return new LearningLanguageResponse({
      id: learningLanguage.id,
      name: learningLanguage.language.name,
      code: learningLanguage.language.code,
      level: learningLanguage.level,
      createdAt: learningLanguage.createdAt,
    });
  }
}

export class LearningLanguageWithTandemResponse extends LearningLanguageResponse {
  @ApiProperty({ type: TandemResponse })
  @Expose({ groups: ['read'] })
  @Optional()
  tandem?: TandemResponse;

  constructor(partial: Partial<LearningLanguageWithTandemResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguageWithTandem,
    includeProfile = false,
  ): LearningLanguageWithTandemResponse {
    return new LearningLanguageWithTandemResponse({
      ...LearningLanguageResponse.fromDomain(learningLanguage, includeProfile),
      tandem:
        learningLanguage.tandem &&
        TandemResponse.fromDomain(learningLanguage.tandem),
    });
  }
}
