import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  Language,
  LearningLanguageWithTandemWithPartnerLearningLanguage,
} from 'src/core/models';
import { ProfileWithTandemsProfiles } from 'src/core/models/profileWithTandemsProfiles.model';
import { LearningLanguageWithTandemsProfilesResponse } from '../learning-languages';
import { UserResponse } from '../users';

class NativeLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiPropertyOptional({ type: 'string', example: 'France' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<Language>) {
    Object.assign(this, partial);
  }
}

class MasteredLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiPropertyOptional({ type: 'string', example: 'France' })
  @Expose({ groups: ['read'] })
  name?: string;

  constructor(partial: Partial<Language>) {
    Object.assign(this, partial);
  }
}

export class ProfileWithTandemsProfilesResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  user: UserResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  learningLanguages: LearningLanguageWithTandemsProfilesResponse[];

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new NativeLanguageResponse(value))
  nativeLanguage: NativeLanguageResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map(
      (masteredLanguage: Language) =>
        new MasteredLanguageResponse(masteredLanguage),
    ),
  )
  masteredLanguages: MasteredLanguageResponse[];

  constructor(partial: Partial<ProfileWithTandemsProfilesResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(
    profile: ProfileWithTandemsProfiles,
  ): ProfileWithTandemsProfilesResponse {
    return new ProfileWithTandemsProfilesResponse({
      id: profile.id,
      user: UserResponse.fromDomain(profile.user),
      nativeLanguage: {
        name: profile.nativeLanguage.name,
        code: profile.nativeLanguage.code,
      },
      masteredLanguages: profile.masteredLanguages.map((masteredLanguage) => ({
        name: masteredLanguage.name,
        code: masteredLanguage.code,
      })),
      learningLanguages: profile.learningLanguages.map(
        (
          learningLanguage: LearningLanguageWithTandemWithPartnerLearningLanguage,
        ) =>
          LearningLanguageWithTandemsProfilesResponse.fromDomain({
            learningLanguage,
          }),
      ),
    });
  }
}
