import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { InterestResponse } from 'src/api/dtos/interests';
import { LearningType, Profile } from 'src/core/models/profile.model';
import { UserResponse } from '../users';
import { ObjectiveResponse } from '../objective';
import { BiographyDto } from './biography';
import { Language } from 'src/core/models';
import { CampusResponse } from '../campus';
import { LearningLanguageResponse } from '../learning-languages';

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

export class ProfileResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  user: UserResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map((val) => new LearningLanguageResponse(val)),
  )
  learningLanguages: LearningLanguageResponse[];

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new NativeLanguageResponse(value))
  nativeLanguage: NativeLanguageResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map(
      (masteredLanguage) => new MasteredLanguageResponse(masteredLanguage),
    ),
  )
  masteredLanguages: MasteredLanguageResponse[];

  @ApiProperty({ type: ObjectiveResponse, isArray: true })
  @Expose({ groups: ['read'] })
  objectives: ObjectiveResponse[];

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  meetingFrequency: string;

  @ApiProperty({ type: InterestResponse, isArray: true })
  @Expose({ groups: ['read'] })
  interests: InterestResponse[];

  @ApiProperty({ type: BiographyDto, nullable: true })
  @Expose({ groups: ['read'] })
  biography?: BiographyDto;

  @ApiProperty({ type: CampusResponse, nullable: true })
  @Expose({ groups: ['read'] })
  campus: CampusResponse;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  certificateOption: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  specificProgram: boolean;

  @ApiProperty({ type: 'string', enum: LearningType })
  @Expose({ groups: ['read'] })
  learningType: LearningType;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profile: Profile): ProfileResponse {
    return new ProfileResponse({
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
      learningLanguages: profile.learningLanguages.map((ll) =>
        LearningLanguageResponse.fromDomain(ll),
      ),
      objectives: profile.objectives.map((objective) =>
        ObjectiveResponse.fromDomain(objective),
      ),
      interests: profile.interests.map((interest) =>
        InterestResponse.fromDomain(interest),
      ),
      meetingFrequency: profile.meetingFrequency,
      biography:
        profile.biography && BiographyDto.fromDomain(profile.biography),
      campus: profile.campus && CampusResponse.fromCampus(profile.campus),
      certificateOption: profile.certificateOption,
      specificProgram: profile.specificProgram,
      learningType: profile.learningType,
    });
  }
}
