import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LearningLanguage, LearningType } from 'src/core/models';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { LearningLanguageResponse } from '../learning-languages';

export class TandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  learningLanguages: LearningLanguageResponse[];

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  compatibilityScore: number;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['tandem:university-validations'] })
  universityValidations?: string[];

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  updatedAt?: Date;

  @Swagger.ApiProperty({ type: 'date' })
  @Expose({ groups: ['read'] })
  createdAt?: Date;

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      learningLanguages:
        tandem.learningLanguages?.map((learningLanguage) =>
          LearningLanguageResponse.fromDomain({ learningLanguage }),
        ) || [],
      status: tandem.status,
      learningType: tandem.learningType,
      compatibilityScore: tandem.compatibilityScore,
      universityValidations: tandem.universityValidations,
      createdAt: tandem.createdAt,
      updatedAt: tandem.updatedAt,
    });
  }
}

export class UserTandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  partnerLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: () => LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  userLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  universityValidations: string[];

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  compatibilityScore: number;

  constructor(partial: Partial<UserTandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    profileId: string,
    tandem: Tandem,
    languageCode?: string,
    countVocabularies?: number,
    countActivities?: number,
  ): UserTandemResponse {
    const { learningLanguageProfile, learningLanguagePartner } =
      tandem.learningLanguages.reduce<{
        learningLanguageProfile: LearningLanguage;
        learningLanguagePartner: LearningLanguage;
      }>(
        (accumulator, value) => {
          if (value.profile.id !== profileId) {
            accumulator.learningLanguagePartner = value;
          } else {
            accumulator.learningLanguageProfile = value;
          }
          return accumulator;
        },
        {
          learningLanguageProfile: null,
          learningLanguagePartner: null,
        },
      );

    if (!learningLanguagePartner.profile) {
      throw new Error('Partner not found');
    }

    return new UserTandemResponse({
      id: tandem.id,
      partnerLearningLanguage: LearningLanguageResponse.fromDomain({
        learningLanguage: learningLanguagePartner,
        languageCode,
      }),
      status: tandem.status,
      userLearningLanguage: LearningLanguageResponse.fromDomain({
        learningLanguage: learningLanguageProfile,
        countVocabularies: countVocabularies,
        countActivities: countActivities,
      }),

      universityValidations: tandem.universityValidations,
      compatibilityScore: tandem.compatibilityScore,
    });
  }
}
