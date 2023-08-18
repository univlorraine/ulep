import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { InterestResponse } from 'src/api/dtos/interests';
import { Profile } from 'src/core/models/profile.model';
import { UserResponse } from '../users';
import { ObjectiveResponse } from '../objective';
import { BiographyDto } from './biography';
import { JOKER_LANGUAGE_CODE } from 'src/core/models';
import { CampusResponse } from '../campus';

class NativeLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

class MasteredLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

class LearningLanguageResponse {
  @ApiPropertyOptional({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code?: string;

  @ApiProperty({ type: 'string', example: 'A1' })
  @Expose({ groups: ['read'] })
  level: string;

  constructor(partial: Partial<ProfileResponse>) {
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

  @ApiProperty({ type: () => [LearningLanguageResponse] })
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

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new LearningLanguageResponse(value))
  learningLanguage: LearningLanguageResponse;

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

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profile: Profile): ProfileResponse {
    return new ProfileResponse({
      id: profile.id,
      user: UserResponse.fromDomain(profile.user),
      nativeLanguage: {
        code: profile.nativeLanguage.code,
      },
      masteredLanguages: profile.masteredLanguages.map((masteredLanguage) => ({
        code: masteredLanguage.code,
      })),
      learningLanguages: profile.learningLanguages.map((learningLanguage) => ({
        code:
          learningLanguage.language.code === JOKER_LANGUAGE_CODE
            ? null
            : learningLanguage.language.code,
        level: learningLanguage.level,
      })),
      objectives: profile.objectives.map((objective) =>
        ObjectiveResponse.fromDomain(objective),
      ),
      interests: profile.interests.map(InterestResponse.fromDomain),
      meetingFrequency: profile.meetingFrequency,
      biography:
        profile.biography && BiographyDto.fromDomain(profile.biography),
      campus: profile.campus && CampusResponse.fromCampus(profile.campus),
      certificateOption: profile.certificateOption,
      specificProgram: profile.specificProgram,
    });
  }
}
