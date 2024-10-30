import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { EventStatus, EventType } from 'src/core/models/event.model';
import { PaginationDto } from '../pagination';

export class GetEventsAdminQuery extends PaginationDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  authorUniversityId?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  concernedUniversitiesIds?: string[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsEnum(EventType, { each: true })
  types?: EventType[];

  @ApiProperty()
  @IsOptional()
  languageCode: string;
}
