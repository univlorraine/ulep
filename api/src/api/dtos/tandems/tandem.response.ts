import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Tandem, TandemStatus } from '../../../core/models/tandem.model';
import { ProfileResponse } from '../profiles';
// TODO(NOW+1): move LearningLanguageResponse into separate file
import { LearningLanguageResponse } from '../profiles/learningLanguage';
import { LearningLanguage } from 'src/core/models';

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
      learningLanguages: tandem.learningLanguages.map((ll) =>
        LearningLanguageResponse.fromDomain(ll),
      ),
      status: tandem.status,
    });
  }
}

export class UserTandemResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid', nullable: true })
  @Expose({ groups: ['read'] })
  id: string | null = null;

  @Swagger.ApiProperty({ type: ProfileResponse })
  @Expose({ groups: ['read'] })
  partner: ProfileResponse;

  @Swagger.ApiProperty({ type: 'string', enum: TandemStatus })
  @Expose({ groups: ['read'] })
  status: TandemStatus;

  @Swagger.ApiProperty({ type: LearningLanguageResponse })
  @Expose({ groups: ['read'] })
  learningLanguage: LearningLanguageResponse;

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

    return new UserTandemResponse({
      id: tandem.id,
      partner: ProfileResponse.fromDomain(learningLanguagePartner.profile),
      status: tandem.status,
      learningLanguage: LearningLanguageResponse.fromDomain(
        learningLanguageProfile,
      ),
    });
  }
}
