import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import { Goal, MeetingFrequency, Profile } from 'src/core/models/profile';
import { UniversityResponse } from '../university/university.response';

export class ProfileResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  birthdate: Date;

  @ApiProperty({ enum: Role })
  role: Role;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  university: UniversityResponse;

  @ApiProperty({ enum: Goal, isArray: true })
  goals: Goal[];

  @ApiProperty({ enum: MeetingFrequency })
  meetingFrequency: MeetingFrequency;

  @ApiProperty()
  bios?: string;

  @ApiPropertyOptional()
  avatar?: string;

  static fromDomain(profile: Profile): ProfileResponse {
    return {
      id: profile.id,
      email: profile.email,
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
      goals: profile.goals,
      meetingFrequency: profile.meetingFrequency,
      bios: profile.bios,
      avatar:
        profile.avatar &&
        `${process.env.MINIO_PUBLIC_URL}/${profile.avatar.bucket}/${profile.avatar.name}`,
    };
  }
}
