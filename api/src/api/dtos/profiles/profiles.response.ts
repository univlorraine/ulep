import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { InterestResponse } from 'src/api/dtos/interests';
import { Profile } from 'src/core/models/profile.model';
import { UserResponse } from '../users';

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

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new LearningLanguageResponse(value))
  learningLanguage: LearningLanguageResponse;

  @ApiProperty({ type: 'string', isArray: true })
  @Expose({ groups: ['read'] })
  goals: string[];

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  meetingFrequency: string;

  @ApiProperty({ isArray: true })
  @Expose({ groups: ['read'] })
  interests: InterestResponse[];

  @ApiProperty()
  @Expose({ groups: ['read'] })
  bios?: string;

  @ApiPropertyOptional({ type: 'string', format: 'uri' })
  @Expose({ groups: ['read'] })
  avatar?: string;

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
        code: profile.learningLanguage.code,
        level: profile.level,
      },
      goals: [], // TODO
      interests: profile.interests.map(
        (interest) => new InterestResponse({ id: interest.name.content }),
      ),
      meetingFrequency: profile.meetingFrequency,
      bios: profile.bio,
    });
  }
}
