import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import {
  JOKER_LANGUAGE_CODE,
  LearningLanguage,
  ProficiencyLevel,
  Profile,
} from 'src/core/models';
import { ProfileResponse } from './profiles.response';

export class LearningLanguageDto {
  @Swagger.ApiProperty({ type: 'string', example: 'EN' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  code: string;

  @Swagger.ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  constructor(partial: Partial<LearningLanguageDto>) {
    Object.assign(this, partial, { code: partial.code || JOKER_LANGUAGE_CODE });
  }

  static fromDomain(learningLanguage: LearningLanguage): LearningLanguageDto {
    return new LearningLanguageDto({
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}

export class LearningLanguageResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code?: string;

  @Swagger.ApiProperty({ type: 'string', example: 'A1' })
  @Expose({ groups: ['read'] })
  level: string;

  @Swagger.ApiProperty({ type: Profile })
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
        code: learningLanguage.language.code,
        level: learningLanguage.level,
        profile: ProfileResponse.fromDomain(learningLanguage.profile),
      });
    }

    return new LearningLanguageResponse({
      id: learningLanguage.id,
      code: learningLanguage.language.code,
      level: learningLanguage.level,
    });
  }
}
