import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { LearningType, ProficiencyLevel } from 'src/core/models';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';
import { BiographyDto } from './biography';

export class CreateProfileRequest
  implements Omit<CreateProfileCommand, 'user'>
{
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsUUID()
  id: string;

  // TODO(herve): we should use ids instead of codes
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguageCode: string;

  // TODO(herve): we should use ids instead of codes
  @ApiPropertyOptional({ type: 'string', example: 'EN' })
  @IsNotEmpty()
  @IsOptional()
  learningLanguageCode?: string;

  @Swagger.ApiProperty({ enum: ProficiencyLevel, example: 'B2' })
  @IsEnum(ProficiencyLevel)
  level: ProficiencyLevel;

  // TODO(herve): we should use ids instead of codes
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

  @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @ArrayMaxSize(10)
  @ArrayMinSize(5)
  @IsNotEmpty({ each: true })
  interests: string[];

  @Swagger.ApiProperty()
  @IsBoolean()
  sameGender: boolean;

  @Swagger.ApiProperty()
  @IsBoolean()
  sameAge: boolean;

  @Swagger.ApiProperty({ type: BiographyDto })
  @Transform(({ value }) => new BiographyDto(value))
  @IsObject()
  @ValidateNested()
  biography: BiographyDto;
}
