import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { InterestResponse } from 'src/api/dtos/interests';
import { Profile } from 'src/core/models/profile.model';
import { UserResponse } from '../users';
import { ObjectiveResponse } from '../objective';
import { BiographyDto } from './biography';

class NativeLanguageResponse {
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
  @Expose({ groups: ['profile:read'] })
  user: UserResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new NativeLanguageResponse(value))
  nativeLanguage: NativeLanguageResponse;

  @ApiProperty({ nullable: true })
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
      learningLanguage: {
        code: profile.learningLanguage?.code,
        level: profile.level,
      },
      objectives: profile.objectives.map(ObjectiveResponse.fromDomain),
      interests: profile.interests.map(InterestResponse.fromDomain),
      meetingFrequency: profile.meetingFrequency,
      biography:
        profile.biography && BiographyDto.fromDomain(profile.biography),
    });
  }
}
