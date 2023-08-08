import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { LearningType, LearningLanguage } from 'src/core/models';
import { CreateProfileCommand } from 'src/core/usecases/profiles/create-profile.usecase';
import { BiographyDto } from './biography';
import { Transform } from 'class-transformer';
import { LearningLanguageDto } from './learningLanguage';

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

  @Swagger.ApiProperty({ type: () => [LearningLanguageDto] })
  @IsArray()
  @Transform(({ value }) => value.map((val) => new LearningLanguageDto(val)))
  @ValidateNested()
  learningLanguages: LearningLanguage[];

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
  @ArrayMaxSize(5)
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
