import { ApiProperty } from '@nestjs/swagger';
import { Gender, Role } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
} from 'class-validator';
import { Goal, MeetingFrequency } from 'src/core/models/profile';

export class CreateProfileRequest {
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

  @ApiProperty({ enum: Goal, isArray: true })
  @IsEnum(Goal, { each: true })
  goals: Goal[];

  @ApiProperty({ enum: MeetingFrequency })
  @IsEnum(MeetingFrequency)
  meetingFrequency: MeetingFrequency;

  @ApiProperty()
  bios?: string;
}
