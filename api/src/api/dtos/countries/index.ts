import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../core/models/country';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateCountryCommand } from 'src/core/usecases/countries/create-country.usecase';

export class CreateCountryRequest implements CreateCountryCommand {
  @ApiProperty({ type: 'string', example: 'FR' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ type: 'string', example: 'France' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CountryResponse {
  @ApiProperty({ type: 'string', example: 'FR' })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({ type: 'string', example: 'France' })
  @Expose({ groups: ['read', 'country:read'] })
  name: string;

  constructor(partial: Partial<CountryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(country: Country): CountryResponse {
    return new CountryResponse({ code: country.code, name: country.name });
  }
}
