import * as Swagger from '@nestjs/swagger';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { BiographyDto } from './biography';
import { AvailabilitesDto } from 'src/api/dtos/profiles/availabilities';
import { Gender, MeetingFrequency } from 'src/core/models';

export class UpdateProfileRequest {
  @Swagger.ApiProperty({ type: 'number' })
  @IsOptional()
  age: number;

  @Swagger.ApiProperty({ type: AvailabilitesDto })
  @IsOptional()
  @Type(() => AvailabilitesDto)
  availabilities: AvailabilitesDto;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  availabilitiesNote?: string;

  @Swagger.ApiProperty({ type: 'boolean' })
  @IsOptional()
  availabilitiesNotePrivacy?: boolean;

  @Swagger.ApiProperty({ type: BiographyDto })
  @IsOptional()
  @Type(() => BiographyDto)
  biography: BiographyDto;

  @Swagger.ApiProperty({ type: 'string', example: 'John.doe@email.com' })
  @IsString()
  @IsOptional()
  email: string;

  @Swagger.ApiProperty({ type: 'string', example: 'John' })
  @IsString()
  @IsOptional()
  firstname: string;

  @Swagger.ApiProperty({ type: 'string', enum: Gender })
  @IsString()
  @IsOptional()
  gender?: Gender;

  @Swagger.ApiProperty({ type: 'string', format: 'uuid', isArray: true })
  @IsOptional()
  interests: string[];

  @Swagger.ApiProperty({ type: 'string', example: 'Doe' })
  @IsString()
  @IsOptional()
  lastname: string;

  @ApiPropertyOptional({ type: 'string', example: ['FR'] })
  @IsOptional()
  masteredLanguageCodes?: string[];

  @Swagger.ApiProperty({ type: 'string', enum: MeetingFrequency })
  @IsOptional()
  @IsEnum(MeetingFrequency)
  meetingFrequency: MeetingFrequency;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @IsOptional()
  nativeLanguageCode: string;

  @Swagger.ApiProperty({ type: 'string', isArray: true, format: 'uuid' })
  @IsUUID('4', { each: true })
  objectives: string[];
}
