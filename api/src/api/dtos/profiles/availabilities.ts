import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Availabilites, occurence } from 'src/core/models';

export class AvailabilitesDto {
  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  monday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  tuesday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  wednesday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  thursday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  friday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  saturday: occurence;

  @Swagger.ApiProperty({ type: 'string', enum: occurence })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  sunday: occurence;

  constructor(partial: Partial<AvailabilitesDto>) {
    Object.assign(this, partial);
  }

  static fromDomain(availabilities: Availabilites): AvailabilitesDto {
    return new AvailabilitesDto(availabilities);
  }
}
