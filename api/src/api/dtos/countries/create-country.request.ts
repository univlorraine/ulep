import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryRequest {
  @ApiProperty({
    type: 'string',
    description: 'ISO 3166-1 code',
    example: 'FR',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    type: 'string',
    example: 'France',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
