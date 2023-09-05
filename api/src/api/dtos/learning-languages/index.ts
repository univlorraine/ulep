import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileResponse } from '../profiles';
import {
  JOKER_LANGUAGE_CODE,
  LearningLanguage,
  ProficiencyLevel,
} from 'src/core/models';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LearningLanguageDto {
  @ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial, {
      code: partial?.code || JOKER_LANGUAGE_CODE,
    });
  }

  static fromDomain(learningLanguage: LearningLanguage): LearningLanguageDto {
    return new LearningLanguageDto({
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}

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
