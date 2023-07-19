import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsUUID,
  Min,
} from 'class-validator';
import {
  Goal,
  CEFRLevel,
  MeetingFrequency,
  Role,
  Gender,
} from '../../../core/models/profile';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';

export class CreateProfileRequest implements Omit<CreateProfileCommand, 'id'> {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: 'integer', minimum: 1 })
  @IsInt()
  @Min(1)
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

  @ApiProperty()
  @IsNotEmpty()
  learningLanguage: string;

  @ApiProperty()
  @IsIn(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  proficiencyLevel: CEFRLevel;

  @ApiProperty({ enum: ['ETANDEM', 'TANDEM', 'BOTH'] })
  @IsIn(['ETANDEM', 'TANDEM', 'BOTH'])
  learningType: 'ETANDEM' | 'TANDEM' | 'BOTH';

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
