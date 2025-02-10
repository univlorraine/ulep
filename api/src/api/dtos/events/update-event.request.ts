import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  isArray,
  IsArray,
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventTranslation, EventType } from 'src/core/models/event.model';

export class UpdateEventRequest {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  languageCode: string;

  @ApiProperty()
  @IsString()
  status: string;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsString()
  type: EventType;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  translations?: EventTranslation[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  eventUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  addressName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  imageCredit?: string;

  @ApiProperty()
  @Transform(({ value }) => (value ? value === 'true' : undefined))
  @IsBoolean()
  withSubscription: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  diffusionLanguages: string[];

  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => (isArray(value) ? value : [value]))
  concernedUniversities: string[];
}
