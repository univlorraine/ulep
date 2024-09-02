import * as Swagger from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNewsRequest {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @IsNotEmpty()
  @IsUUID()
  universityId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Swagger.ApiProperty({ type: 'string' })
  @IsString()
  @IsNotEmpty()
  languageCode: string;

  @Swagger.ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  translations?: string;
}
