import { ApiProperty } from '@nestjs/swagger';
import { Country } from '../../../core/models/country';
import { Expose } from 'class-transformer';

export class CountryResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'ISO 3166-1 code',
    example: 'FR',
  })
  @Expose({ groups: ['read'] })
  code: string;

  @ApiProperty({ type: 'string', example: 'France' })
  @Expose({ groups: ['read'] })
  name: string;

  constructor(partial: Partial<CountryResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(country: Country): CountryResponse {
    return new CountryResponse({
      id: country.id,
      code: country.code,
      name: country.name,
    });
  }
}
