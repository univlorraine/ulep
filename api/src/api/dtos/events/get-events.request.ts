import { ApiProperty } from '@nestjs/swagger';
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
  types?: EventType[];

  @ApiProperty()
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  languageCodes?: string[];
}
