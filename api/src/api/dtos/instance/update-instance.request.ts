import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsHexColor,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { EditoMandatoryTranslations } from 'src/core/models/Instance.model';

export class UpdateInstanceRequest {
  @ApiPropertyOptional({ type: 'string', example: 'Université de Lorraine' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  cguUrl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  confidentialityUrl?: string;

  @ApiPropertyOptional({ type: 'string', format: 'url' })
  @IsOptional()
  @IsUrl()
  ressourceUrl?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryBackgroundColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  primaryDarkColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryBackgroundColor?: string;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  @IsHexColor()
  secondaryDarkColor?: string;

  @ApiPropertyOptional({ type: 'boolean' })
  @IsOptional()
  @Type(() => Boolean)
  isInMaintenance?: boolean;

  @ApiPropertyOptional({ type: 'number' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  daysBeforeClosureNotification?: number;

  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  @IsArray()
  editoMandatoryTranslations?: EditoMandatoryTranslations[];

  @ApiPropertyOptional({ type: 'array', items: { type: 'string' } })
  @IsOptional()
  @IsArray()
  editoCentralUniversityTranslations?: string[];
}
