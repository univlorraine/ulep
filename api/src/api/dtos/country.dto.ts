import { ApiProperty } from '@nestjs/swagger';
import { Country } from 'src/core/models/country';

export class CountryDto {
  @ApiProperty({ readOnly: true })
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  static fromDomain(country: Country): CountryDto {
    return {
      id: country.id,
      code: country.code,
      name: country.name,
    };
  }
}
