import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Instance } from 'src/core/models/Instance.model';
import { MediaObjectResponse } from '../medias';

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
  @Type(() => Boolean)
  hasConnector: boolean;

  @ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  @Type(() => Boolean)
  isInMaintenance: boolean;

  @ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  @Type(() => Number)
  daysBeforeClosureNotification: number;

  @ApiProperty({ type: () => MediaObjectResponse })
  @Expose({ groups: ['read'] })
  defaultCertificateFile?: MediaObjectResponse;

  constructor(partial: Partial<InstanceResponse>) {
    Object.assign(this, partial);
  }

  static fromDomain(instance: Instance): InstanceResponse {
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
      isInMaintenance: instance.isInMaintenance,
      daysBeforeClosureNotification: instance.daysBeforeClosureNotification,
      defaultCertificateFile: instance.defaultCertificateFile
        ? MediaObjectResponse.fromMediaObject(instance.defaultCertificateFile)
        : null,
    });
  }
}
