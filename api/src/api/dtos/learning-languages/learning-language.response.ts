import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  LearningLanguage,
  LearningLanguageWithTandem,
  LearningLanguageWithTandemWithPartnerLearningLanguage,
  LearningType,
} from 'src/core/models';
import { CampusResponse } from '../campus';
import { MediaObjectResponse } from '../medias';
import { CustomLearningGoalResponse } from '../objective';
import { ProfileResponse } from '../profiles';
import { TandemResponse } from '../tandems';
import { TandemWithPartnerLearningLanguageResponse } from '../tandems/tandem-with-patner-learning-language.response';
import { LanguageResponse } from './../languages/index';

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

  @ApiProperty({ type: () => () => ProfileResponse })
  @Expose({ groups: ['learning-language:profile'] })
  profile: ProfileResponse;

  @ApiProperty({ type: 'date' })
  @Optional()
  @Expose({ groups: ['read'] })
  createdAt?: Date;

  @ApiProperty({ type: () => () => CampusResponse, nullable: true })
  @Expose({ groups: ['read'] })
  campus: CampusResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  certificateOption: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  learningJournal: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  consultingInterview: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sharedCertificate: boolean;

  @ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  certificateFile: MediaObjectResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  specificProgram: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameGender: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  sameAge: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  hasPriority: boolean;

  @ApiProperty({ type: 'string', example: 'john@example.com' })
  @Expose({ groups: ['read'] })
  sameTandemEmail?: string;

  @ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  @ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  tandemLanguage?: LanguageResponse;

  @ApiProperty({ type: () => CustomLearningGoalResponse })
  @Expose({ groups: ['read'] })
  customLearningGoals?: CustomLearningGoalResponse[];

  @ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  sharedLogsDate?: Date;

  constructor(partial: Partial<LearningLanguageResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguage,
    languageCode?: string,
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
      learningJournal: learningLanguage.learningJournal,
      consultingInterview: learningLanguage.consultingInterview,
      sharedCertificate: learningLanguage.sharedCertificate,
      certificateFile:
        learningLanguage.certificateFile &&
        MediaObjectResponse.fromMediaObject(learningLanguage.certificateFile),
      specificProgram: learningLanguage.specificProgram,
      learningType: learningLanguage.learningType,
      sameGender: learningLanguage.sameGender,
      sameAge: learningLanguage.sameAge,
      hasPriority: learningLanguage.hasPriority,
      sameTandemEmail: learningLanguage.sameTandemEmail,
      sharedLogsDate: learningLanguage.sharedLogsDate,
      tandemLanguage:
        learningLanguage.tandemLanguage &&
        LanguageResponse.fromLanguage(learningLanguage.tandemLanguage),
      profile:
        learningLanguage.profile &&
        ProfileResponse.fromDomain(learningLanguage.profile, languageCode),
      customLearningGoals:
        learningLanguage.customLearningGoals &&
        learningLanguage.customLearningGoals.map((customLearningGoal) =>
          CustomLearningGoalResponse.fromDomain(customLearningGoal),
        ),
    });

    return response;
  }
}

export class LearningLanguageWithTandemResponse extends LearningLanguageResponse {
  @ApiProperty({ type: () => TandemResponse })
  @Expose({ groups: ['read'] })
  @Optional()
  tandem?: TandemResponse;

  constructor(partial: Partial<LearningLanguageWithTandemResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguageWithTandem,
  ): LearningLanguageWithTandemResponse {
    return new LearningLanguageWithTandemResponse({
      ...LearningLanguageResponse.fromDomain(learningLanguage),
      tandem:
        learningLanguage.tandem &&
        TandemResponse.fromDomain(learningLanguage.tandem),
    });
  }
}

export class LearningLanguageWithTandemsProfilesResponse extends LearningLanguageResponse {
  @ApiProperty({ type: () => TandemWithPartnerLearningLanguageResponse })
  @Expose({ groups: ['read'] })
  tandem?: TandemWithPartnerLearningLanguageResponse;

  constructor(partial: Partial<LearningLanguageWithTandemsProfilesResponse>) {
    super(partial);
    Object.assign(this, partial);
  }

  static fromDomain(
    learningLanguage: LearningLanguageWithTandemWithPartnerLearningLanguage,
  ): LearningLanguageWithTandemsProfilesResponse {
    return new LearningLanguageWithTandemsProfilesResponse({
      ...LearningLanguageResponse.fromDomain(learningLanguage),
      tandem:
        learningLanguage.tandem &&
        TandemWithPartnerLearningLanguageResponse.fromDomain(
          learningLanguage.tandem,
        ),
    });
  }
}
