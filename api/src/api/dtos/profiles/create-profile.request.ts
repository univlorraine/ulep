import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  Goal,
  CEFRLevel,
  MeetingFrequency,
  Role,
  Gender,
} from '../../../core/models/profile';

export class CreateProfileRequest {
  @ApiProperty({ type: 'string', format: 'uuid' })
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

  @ApiProperty({ type: 'integer', minimum: 16, maximum: 80 })
  @IsInt()
  @Min(16)
  @Max(80)
  age: number;

  @ApiProperty({ enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  university: string;

  @ApiProperty({ type: 'string', format: 'uuid' })
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

  @ApiProperty({ example: ['music', 'sports', 'movies'] })
  @ArrayMaxSize(5)
  interests: string[];

  @ApiProperty()
  preferSameGender: boolean;

  @ApiProperty()
  bios?: string;
}
