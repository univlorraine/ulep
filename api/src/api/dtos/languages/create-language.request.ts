import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// TODO Add isAvailable false
export class CreateLanguageRequest {
  @ApiProperty({
    type: 'string',
    description: 'Language name',
    example: 'French',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'ISO 639-1 code',
    example: 'FR',
    uniqueItems: true,
  })
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
