import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class BiographyDto {
  @Swagger.ApiProperty({ type: 'string', example: 'Can fly at night.' })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  superpower: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Paris' })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  favoritePlace: string;

  @Swagger.ApiProperty({ type: 'string', example: 'Stuck in elevator.' })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  experience: string;

  @Swagger.ApiProperty({ type: 'string', example: 'I got kidnapped' })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  anecdote: string;

  constructor(partial: Partial<BiographyDto>) {
    Object.assign(this, partial);
  }

  static fromDomain(biography: { [key: string]: string }): BiographyDto {
    return new BiographyDto(biography);
  }
}
