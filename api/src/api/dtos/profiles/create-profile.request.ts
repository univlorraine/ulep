import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { CEFRLevel, Role, Gender } from '../../../core/models/profile';
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

  @ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguage: string;

  @ApiPropertyOptional({ type: 'string', example: ['FR'] })
  @IsNotEmpty({ each: true })
  @IsOptional()
  masteredLanguages?: string[];

  @ApiPropertyOptional({ type: 'string', example: 'EN' })
  @IsNotEmpty()
  @IsOptional()
  learningLanguage?: string;

  @ApiProperty({ type: 'string', example: 'B2' })
  @IsIn(['A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
  proficiencyLevel: CEFRLevel;

  @ApiProperty({ enum: ['ETANDEM', 'TANDEM', 'BOTH'] })
  @IsIn(['ETANDEM', 'TANDEM', 'BOTH'])
  learningType: 'ETANDEM' | 'TANDEM' | 'BOTH';

  @ApiProperty({
    type: 'string',
    isArray: true,
    example: ['SPEAK_LIKE_NATIVE'],
  })
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  goals: string[];

  @ApiProperty({ type: 'string', example: 'ONCE_A_WEEK' })
  @IsNotEmpty()
  meetingFrequency: string;

  @ApiProperty({ example: ['music', 'sports', 'movies'] })
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  interests: string[];

  @ApiProperty()
  preferSameGender: boolean;

  @ApiProperty()
  bios?: string;
}
