import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { EventType } from 'src/core/models/event.model';
import { PaginationDto } from '../pagination';

export class GetEventsQuery extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsEnum(EventType, { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  types?: EventType[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  languageCodes?: string[];
}
