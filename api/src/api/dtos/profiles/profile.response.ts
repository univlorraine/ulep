import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { Goal, MeetingFrequency, Profile } from '../../../core/models/profile';
import { UniversityResponse } from '../university/university.response';
import { Expose, Transform } from 'class-transformer';

class NativeLanguageResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  code: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

class LearningLanguageResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  level: string;

  constructor(partial: Partial<ProfileResponse>) {
    Object.assign(this, partial);
  }
}

export class ProfileResponse {
  @ApiProperty()
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty()
  @Expose({ groups: ['profile:read'] })
  email: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  firstname: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  lastname: string;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  birthdate: Date;

  @ApiProperty({ enum: Gender })
  @Expose({ groups: ['read'] })
  gender: Gender;

  @ApiProperty()
  @Expose({ groups: ['read'] })
  @Transform(({ value }) => new UniversityResponse(value))
  university: UniversityResponse;

  @ApiProperty({ enum: Role })
  @Expose({ groups: ['profile:read'] })
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

  @ApiProperty()
  @Expose({ groups: ['read'] })
  bios?: string;

  @ApiPropertyOptional()
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
      birthdate: profile.birthdate,
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
        level: profile.learningLanguage.level.toString(),
      },
      goals: profile.goals,
      meetingFrequency: profile.preferences.meetingFrequency,
      bios: profile.bios,
      avatar:
        profile.avatar &&
        `${process.env.MINIO_PUBLIC_URL}/${profile.avatar.bucket}/${profile.avatar.name}`,
    });
  }
}
