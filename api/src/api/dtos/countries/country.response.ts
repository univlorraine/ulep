import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../core/models/country';

export class CountryResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  static fromDomain(country: Country): CountryResponse {
    return {
      id: country.id,
      code: country.code,
      name: country.name,
    };
  }
}
