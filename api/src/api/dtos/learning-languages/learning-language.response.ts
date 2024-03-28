import { LanguageResponse } from './../languages/index';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ProfileResponse } from '../profiles';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  LearningType,
} from 'src/core/models';
import { Optional } from '@nestjs/common';
import { TandemResponse } from '../tandems';
import { CampusResponse } from '../campus';

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

  @ApiProperty({ type: CampusResponse, nullable: true })
  @Expose({ groups: ['read'] })
  campus: CampusResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  certificateOption: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  specificProgram: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameGender: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameAge: boolean;

  @ApiProperty({ type: 'string', example: 'john@example.com' })
  @Expose({ groups: ['read'] })
  sameTandemEmail?: string;

  @ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  @ApiProperty({ type: LanguageResponse })
  @Expose({ groups: ['read'] })
  tandemLanguage?: LanguageResponse;

  constructor(partial: Partial<LearningLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguage,
    includeProfile = false,
  ): LearningLanguageResponse {
    const response = new LearningLanguageResponse({
      id: learningLanguage.id,
      name: learningLanguage.language.name,
      code: learningLanguage.language.code,
      level: learningLanguage.level,
      createdAt: learningLanguage.createdAt,
      campus:
        learningLanguage.campus &&
        CampusResponse.fromCampus(learningLanguage.campus),
      certificateOption: learningLanguage.certificateOption,
      specificProgram: learningLanguage.specificProgram,
      learningType: learningLanguage.learningType,
      sameGender: learningLanguage.sameGender,
      sameAge: learningLanguage.sameAge,
      sameTandemEmail: learningLanguage.sameTandemEmail,
      tandemLanguage:
        learningLanguage.tandemLanguage &&
        LanguageResponse.fromLanguage(learningLanguage.tandemLanguage),
    });

    if (includeProfile) {
      return new LearningLanguageResponse({
        ...response,
        profile: ProfileResponse.fromDomain(learningLanguage.profile),
      });
    }

    return response;
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
