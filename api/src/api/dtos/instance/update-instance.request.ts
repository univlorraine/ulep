import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsHexColor,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class InstanceRequest {
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
}
