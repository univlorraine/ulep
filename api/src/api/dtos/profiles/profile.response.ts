import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Gender,
  Goal,
  MeetingFrequency,
  Profile,
  Role,
} from '../../../core/models/profile';
import { UniversityResponse } from '../university/university.response';
import { Expose, Transform } from 'class-transformer';

class NativeLanguageResponse {
  @ApiProperty({
    type: 'string',
    description: 'ISO 639-1 code',
    example: 'FR',
  })
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

class LearningLanguageResponse {
  @ApiProperty({
    type: 'string',
    description: 'ISO 639-1 code',
    example: 'FR',
  })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({
    type: 'string',
    description: 'CEFR level',
    example: 'A1',
  })
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

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new UniversityResponse(value))
  university: UniversityResponse;

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
      firstname: profile.firstname,
      lastname: profile.lastname,
      age: profile.age,
      role: profile.role,
      gender: profile.gender,
      university: {
        id: profile.university.id,
        name: profile.university.name,
        timezone: profile.university.timezone,
        country: {
          id: profile.university.country.id,
          code: profile.university.country.code,
          name: profile.university.country.name,
        },
        admissionStart: profile.university.admissionStart,
        admissionEnd: profile.university.admissionEnd,
      },
      nativeLanguage: {
        code: profile.nativeLanguage.code,
      },
      learningLanguage: {
        code: profile.learningLanguage.code,
        level: profile.learningLanguageLevel.toString(),
      },
      goals: Array.from(profile.goals),
      interests: Array.from(profile.interests),
      meetingFrequency: profile.preferences.meetingFrequency,
      bios: profile.bios,
      avatar:
        profile.avatar &&
        `${process.env.MINIO_PUBLIC_URL}/${profile.avatar.bucket}/${profile.avatar.name}`,
    });
  }
}
