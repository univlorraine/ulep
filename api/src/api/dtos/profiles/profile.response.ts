import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Gender,
  Goal,
  MeetingFrequency,
  Profile,
  Role,
} from '../../../core/models/profile';
import { Expose, Transform } from 'class-transformer';

class NativeLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

class LearningLanguageResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

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

  @ApiProperty({ type: 'string', format: 'email' })
  @Expose({ groups: ['profile:read'] })
  email: string;

  @ApiProperty({ type: 'string', example: 'John' })
  @Expose({ groups: ['read'] })
  firstname: string;

  @ApiProperty({ type: 'string', example: 'Doe' })
  @Expose({ groups: ['read'] })
  lastname: string;

  @ApiProperty({ type: 'number', example: 20 })
  @Expose({ groups: ['read'] })
  age: number;

  @ApiProperty({ enum: Gender })
  @Expose({ groups: ['read'] })
  gender: Gender;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  university: string;

  @ApiProperty({ enum: Role })
  @Expose({ groups: ['read'] })
  role: Role;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new NativeLanguageResponse(value))
  nativeLanguage: NativeLanguageResponse;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new LearningLanguageResponse(value))
  learningLanguage: LearningLanguageResponse;

  @ApiProperty({ enum: Goal, isArray: true })
  @Expose({ groups: ['read'] })
  goals: Goal[];

  @ApiProperty({ enum: MeetingFrequency })
  @Expose({ groups: ['read'] })
  meetingFrequency: MeetingFrequency;

  @ApiProperty({ isArray: true, example: ['music', 'sport'] })
  @Expose({ groups: ['read'] })
  interests: string[];

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
      email: profile.user.email,
      firstname: profile.user.firstname,
      lastname: profile.user.lastname,
      age: profile.personalInformation.age,
      role: profile.role,
      gender: profile.personalInformation.gender,
      university: profile.university.id,
      nativeLanguage: {
        code: profile.languages.nativeLanguage,
      },
      learningLanguage: {
        code: profile.languages.learningLanguage,
        level: profile.languages.learningLanguageLevel,
      },
      goals: Array.from(profile.preferences.goals),
      interests: Array.from(profile.personalInformation.interests),
      meetingFrequency: profile.preferences.meetingFrequency,
      bios: profile.personalInformation.bio,
      avatar:
        profile.avatar &&
        `${process.env.MINIO_PUBLIC_URL}/${profile.avatar.bucket}/${profile.avatar.name}`,
    });
  }
}
