import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { ProfileResponse } from '../profiles';
import { LearningLanguage } from 'src/core/models';
import { LearningLanguageResponse } from '../learning-languages';

export class TandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: LearningLanguageResponse, isArray: true })
  @Expose({ groups: ['read'] })
  learningLanguages: LearningLanguageResponse[];

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  constructor(partial: Partial<TandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(tandem: Tandem): TandemResponse {
    return new TandemResponse({
      id: tandem.id,
      learningLanguages:
        tandem.learningLanguages?.map((ll) =>
          LearningLanguageResponse.fromDomain(ll),
        ) || [],
      status: tandem.status,
    });
  }
}

export class UserTandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  partnerLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  userLearningLanguage: LearningLanguageResponse;

  @Swagger.ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  universityValidations: string[];

  constructor(partial: Partial<UserTandemResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profileId: string, tandem: Tandem): UserTandemResponse {
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

    // TODO(NOW+2): Check if userLearningLanguage is really needed

    return new UserTandemResponse({
      id: tandem.id,
      partnerLearningLanguage: LearningLanguageResponse.fromDomain(
        learningLanguagePartner,
        true,
      ),
      status: tandem.status,
      userLearningLanguage: LearningLanguageResponse.fromDomain(
        learningLanguageProfile,
      ),
      universityValidations: tandem.universityValidations,
    });
  }
}
