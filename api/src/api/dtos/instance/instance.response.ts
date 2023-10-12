import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { configuration } from 'src/configuration';
import { Instance } from 'src/core/models/Instance.model';

export class InstanceResponse {
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

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  hasConnector: boolean;

  constructor(partial: Partial<InstanceResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Instance): InstanceResponse {
    const config = configuration();
    return new InstanceResponse({
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
      hasConnector: !!(config.connectorToken && config.connectorUrl),
    });
  }
}
