import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// TODO Add isAvailable false
export class CreateLanguageRequest {
  @ApiProperty()
  @IsUUID()
  id: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ default: false })
  @Type(() => Boolean)
  @IsOptional()
  enabled: boolean;
}

export class UpdateLanguageRequest {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;
}
