import * as Swagger from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Translation } from 'src/core/models';

export class UpdateActivityThemeCategoryRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  name?: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  languageCode?: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}
