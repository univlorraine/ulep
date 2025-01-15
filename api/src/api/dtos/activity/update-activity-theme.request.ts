import * as Swagger from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Translation } from 'src/core/models';

export class UpdateActivityThemeRequest {
  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsOptional()
  content: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  @IsArray()
  translations?: Translation[];
}
