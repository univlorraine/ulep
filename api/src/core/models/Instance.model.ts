import { MediaObject } from 'src/core/models/media.model';

interface InstanceProps {
  id: string;
  name: string;
  email: string;
  ressourceUrl: string;
  cguUrl: string;
  confidentialityUrl: string;
  primaryColor: string;
  primaryBackgroundColor: string;
  primaryDarkColor: string;
  secondaryColor: string;
  secondaryBackgroundColor: string;
  secondaryDarkColor: string;
  isInMaintenance: boolean;
  daysBeforeClosureNotification: number;
  defaultCertificateFile?: MediaObject;
}

export class Instance {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly ressourceUrl: string;
  readonly cguUrl: string;
  readonly confidentialityUrl: string;
  readonly primaryColor: string;
  readonly primaryBackgroundColor: string;
  readonly primaryDarkColor: string;
  readonly secondaryColor: string;
  readonly secondaryBackgroundColor: string;
  readonly secondaryDarkColor: string;
  readonly isInMaintenance: boolean;
  readonly daysBeforeClosureNotification: number;
  readonly defaultCertificateFile?: MediaObject;
  logoURL: string;

  constructor(instance: InstanceProps) {
    this.id = instance.id;
    this.name = instance.name;
    this.email = instance.email;
    this.ressourceUrl = instance.ressourceUrl;
    this.cguUrl = instance.cguUrl;
    this.confidentialityUrl = instance.confidentialityUrl;
    this.primaryColor = instance.primaryColor;
    this.primaryBackgroundColor = instance.primaryBackgroundColor;
    this.primaryDarkColor = instance.primaryDarkColor;
    this.secondaryColor = instance.secondaryColor;
    this.secondaryBackgroundColor = instance.secondaryBackgroundColor;
    this.secondaryDarkColor = instance.secondaryDarkColor;
    this.isInMaintenance = instance.isInMaintenance;
    this.daysBeforeClosureNotification = instance.daysBeforeClosureNotification;
    this.defaultCertificateFile = instance.defaultCertificateFile;
  }
}
