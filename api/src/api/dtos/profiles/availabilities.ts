import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { Availabilites, AvailabilitesOptions } from 'src/core/models';

export class AvailabilitesDto {
  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  monday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  tuesday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  wednesday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  thursday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  friday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  saturday: AvailabilitesOptions;

  @Swagger.ApiProperty({ type: 'string', enum: AvailabilitesOptions })
  @Expose({ groups: ['read'] })
  @IsString()
  @IsNotEmpty()
  sunday: AvailabilitesOptions;

  constructor(partial: Partial<AvailabilitesDto>) {
    Object.assign(this, partial);
  }

  static fromDomain(availabilities: Availabilites): AvailabilitesDto {
    return new AvailabilitesDto(availabilities);
  }
}
