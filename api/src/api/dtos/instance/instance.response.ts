import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Instance } from 'src/core/models/Instance';

export class InstanceResponse {
  @ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @ApiPropertyOptional({ type: 'string', example: 'Université de Lorraine' })
  @Expose({ groups: ['read'] })
  name: string;

  @ApiPropertyOptional({ type: 'string', format: 'email' })
  @Expose({ groups: ['read'] })
  email: string;

  @ApiProperty({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  cguUrl: string;

  @ApiProperty({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  confidentialityUrl: string;

  @ApiProperty({ type: 'string', format: 'url' })
  @Expose({ groups: ['read'] })
  ressourceUrl: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  primaryColor: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  primaryBackgroundColor: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  primaryDarkColor: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  secondaryColor: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  secondaryBackgroundColor: string;

  @ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  secondaryDarkColor: string;

  constructor(partial: Partial<InstanceResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Instance): InstanceResponse {
    return new InstanceResponse({
      id: instance.id,
      name: instance.name,
      email: instance.email,
      cguUrl: instance.cguUrl,
      confidentialityUrl: instance.confidentialityUrl,
      ressourceUrl: instance.ressourceUrl,
      primaryColor: instance.primaryColor,
      primaryBackgroundColor: instance.primaryBackgroundColor,
      primaryDarkColor: instance.primaryDarkColor,
      secondaryColor: instance.secondaryColor,
      secondaryBackgroundColor: instance.secondaryBackgroundColor,
      secondaryDarkColor: instance.secondaryDarkColor,
    });
  }
}
