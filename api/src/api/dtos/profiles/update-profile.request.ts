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
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { BiographyDto } from './biography';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';
import { Gender, MeetingFrequency } from 'src/core/models';

export class UpdateProfileRequest {
  @Swagger.ApiProperty({ type: 'number' })
  @IsNotEmpty()
  age: number;

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

  @Swagger.ApiProperty({ type: 'string', example: 'John' })
  @IsNotEmpty()
  firstname: string;

  @Swagger.ApiProperty({ type: 'string', enum: Gender })
  @IsString()
  @IsOptional()
  gender?: Gender;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @ArrayMaxSize(10)
  @ArrayMinSize(5)
  @IsNotEmpty({ each: true })
  interests: string[];

  @Swagger.ApiProperty({ type: 'string', example: 'Doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiPropertyOptional({ type: 'string', example: ['FR'] })
  @IsNotEmpty({ each: true })
  @IsOptional()
  masteredLanguageCodes?: string[];

  @Swagger.ApiProperty({ type: 'string', enum: MeetingFrequency })
  @IsNotEmpty()
  @IsEnum(MeetingFrequency)
  meetingFrequency: MeetingFrequency;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsNotEmpty()
  nativeLanguageCode: string;

  @Swagger.ApiProperty({ type: 'string', isArray: true, format: 'uuid' })
  @IsUUID('4', { each: true })
  objectives: string[];
}
