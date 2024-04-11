import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { InterestResponse } from 'src/api/dtos/interests';
import { MeetingFrequency, Profile } from 'src/core/models/profile.model';
import { UserResponse } from '../users';
import { ObjectiveResponse } from '../objective';
import { BiographyDto } from './biography';
import { Language } from 'src/core/models';
import { LearningLanguageResponse } from '../learning-languages';
import { IsObject, ValidateNested, IsBoolean } from 'class-validator';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';
import { TestedLanguageResponse } from 'src/api/dtos/tested-languages/tested-language.response';

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

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) =>
    value.map((testedLanguage) => new TestedLanguageResponse(testedLanguage)),
  )
  testedLanguages: TestedLanguageResponse[];

  @ApiProperty({ type: ObjectiveResponse, isArray: true })
  @Expose({ groups: ['read'] })
  objectives: ObjectiveResponse[];

  @ApiProperty({ type: 'string', enum: MeetingFrequency })
  @Expose({ groups: ['read'] })
  meetingFrequency: MeetingFrequency;

  @ApiProperty({ type: InterestResponse, isArray: true })
  @Expose({ groups: ['read'] })
  interests: InterestResponse[];

  @ApiProperty({ type: AvailabilitesDto })
  @Transform(({ value }) => new AvailabilitesDto(value))
  @Expose({ groups: ['read'] })
  @IsObject()
  @ValidateNested()
  availabilities: AvailabilitesDto;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  @IsBoolean()
  availabilitiesNote: string;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  @IsBoolean()
  availabilitiesNotePrivacy: boolean;

  @ApiProperty({ type: BiographyDto, nullable: true })
  @Expose({ groups: ['read'] })
  biography?: BiographyDto;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(profile: Profile, languageCode?: string): ProfileResponse {
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
      testedLanguages: profile.testedLanguages
        ? profile.testedLanguages.map(TestedLanguageResponse.fromDomain)
        : [],
      learningLanguages: profile.learningLanguages.map((ll) =>
        LearningLanguageResponse.fromDomain(ll),
      ),
      objectives: profile.objectives.map((objective) =>
        ObjectiveResponse.fromDomain(objective, languageCode),
      ),
      interests: profile.interests.map((interest) =>
        InterestResponse.fromDomain(interest, languageCode),
      ),
      meetingFrequency: profile.meetingFrequency,
      availabilities: AvailabilitesDto.fromDomain(profile.availabilities),
      availabilitiesNote: profile.availabilitiesNote,
      availabilitiesNotePrivacy: profile.availabilitiesNotePrivacy,
      biography:
        profile.biography && BiographyDto.fromDomain(profile.biography),
    });
  }
}
