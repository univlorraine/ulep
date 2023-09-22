import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { LearningType } from 'src/core/models';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';
import { BiographyDto } from './biography';
import { LearningLanguageDto } from '../learning-languages';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';

export class CreateProfileRequest
  implements Omit<CreateProfileCommand, 'user'>
{
  // TODO(herve): we should use ids instead of codes
  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguageCode: string;

  @Swagger.ApiProperty({ type: () => [LearningLanguageDto] })
  @IsArray()
  @Transform(({ value }) => value.map((val) => new LearningLanguageDto(val)))
  @ValidateNested()
  learningLanguages: LearningLanguageDto[];

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

  @Swagger.ApiProperty({ type: AvailabilitesDto })
  @Transform(({ value }) => new AvailabilitesDto(value))
  @IsObject()
  @ValidateNested()
  availabilities: AvailabilitesDto;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  availabilitiesNote?: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsBoolean()
  @IsOptional()
  availabilitiesNotePrivacy?: boolean;

  @Swagger.ApiProperty({ type: BiographyDto })
  @Transform(({ value }) => new BiographyDto(value))
  @IsObject()
  @ValidateNested()
  biography: BiographyDto;

  @Swagger.ApiProperty({ type: 'string' })
  @IsUUID()
  @IsOptional()
  campusId?: string;

  @Swagger.ApiProperty()
  @IsBoolean()
  @IsOptional()
  certificateOption?: boolean;

  @Swagger.ApiProperty()
  @IsBoolean()
  @IsOptional()
  specificProgram?: boolean;
}
