import * as Swagger from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { CountryCode } from 'src/core/models';
import { PaginationDto } from '../pagination';
import { UpdateCountryStatusCommand } from 'src/core/usecases';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SortOrder } from '@app/common';

export class UpdateCountryRequest
  implements Omit<UpdateCountryStatusCommand, 'id'>
{
  @Swagger.ApiProperty({ type: 'boolean' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  enable: boolean;
}

export class CountryResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @Swagger.ApiProperty({ type: 'string', example: 'France' })
  @Expose({ groups: ['read', 'country:read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string', example: '🇫🇷' })
  @Expose({ groups: ['read', 'country:read'] })
  emoji: string;

  @Swagger.ApiProperty({ type: 'boolean', example: true })
  @Expose({ groups: ['read', 'country:read'] })
  enable: boolean;

  constructor(partial: Partial<CountryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(country: CountryCode): CountryResponse {
    return new CountryResponse({ ...country });
  }
}

export class GetCountriesQueryParams extends PaginationDto {
  @Swagger.ApiPropertyOptional({ default: true })
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  @IsOptional()
  enable?: boolean;

  @Swagger.ApiPropertyOptional({ default: true })
  @Transform(({ value }) => (value ? value === 'true' : true))
  @IsBoolean()
  @IsOptional()
  pagination?: boolean;

  @ApiPropertyOptional({ type: 'string' })
  @IsOptional()
  order?: SortOrder;
}
