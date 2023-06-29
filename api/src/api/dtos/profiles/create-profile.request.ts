import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {
  ArrayMaxSize,
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import {
  Goal,
  CEFRLevel,
  MeetingFrequency,
} from '../../../core/models/profile';

export class CreateProfileRequest {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsDateString()
  birthdate: Date;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty()
  @IsUUID()
  university: string;

  @ApiProperty()
  @IsUUID()
  nationality: string;

  @ApiProperty()
  @IsNotEmpty()
  learningLanguage: string;

  @ApiProperty()
  @IsIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  proficiencyLevel: CEFRLevel;

  @ApiProperty()
  @IsNotEmpty()
  nativeLanguage: string;

  @ApiProperty({ enum: Goal, isArray: true })
  @IsEnum(Goal, { each: true })
  goals: Goal[];

  @ApiProperty({ enum: MeetingFrequency })
  @IsEnum(MeetingFrequency)
  meetingFrequency: MeetingFrequency;

  @ApiProperty()
  @ArrayMaxSize(5)
  interests: string[];

  @ApiProperty()
  preferSameGender: boolean;

  @ApiProperty()
  bios?: string;
}
