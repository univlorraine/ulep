import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { ProficiencyLevel, LearningType } from 'src/core/models';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';

export class CreateProfileRequest
  implements Omit<CreateProfileCommand, 'user'>
{
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguageCode: string;

  @ApiPropertyOptional({ type: 'string', example: 'EN' })
  @IsNotEmpty()
  @IsOptional()
  learningLanguageCode?: string;

  @Swagger.ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  @ApiPropertyOptional({ type: 'string', example: ['FR'] })
  @IsNotEmpty({ each: true })
  @IsOptional()
  masteredLanguageCodes?: string[];

  @Swagger.ApiProperty({ enum: LearningType })
  @IsEnum(LearningType)
  learningType: LearningType;

  @Swagger.ApiProperty({ type: 'string', isArray: true, format: 'uuid' })
  @IsUUID('4', { each: true })
  objectives: string[];

  @Swagger.ApiProperty({ type: 'string', example: 'ONCE_A_WEEK' })
  @IsNotEmpty()
  meetingFrequency: string;

  @Swagger.ApiProperty({ example: ['music', 'sports', 'movies'] })
  @ArrayMaxSize(5)
  @IsNotEmpty({ each: true })
  interests: string[];

  @Swagger.ApiProperty()
  sameGender: boolean;

  @Swagger.ApiProperty()
  sameAge: boolean;

  @Swagger.ApiProperty()
  bios?: string;
}
