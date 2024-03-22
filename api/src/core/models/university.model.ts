import { CountryCode } from 'src/core/models/country-code.model';
import { Campus } from './campus.model';
import { Language, LanguageStatus } from './language.model';
import { LearningType } from './profile.model';

export enum PairingMode {
  MANUAL = 'MANUAL',
  SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
  AUTOMATIC = 'AUTOMATIC',
}

export interface UniversityProps {
  id: string;
  name: string;
  parent?: string;
  country: CountryCode;
  codes: string[];
  campus: Campus[];
  domains: string[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  openServiceDate: Date;
  closeServiceDate: Date;
  website?: string;
  pairingMode?: PairingMode;
  maxTandemsPerUser: number;
  notificationEmail?: string;
  specificLanguagesAvailable?: Language[];
}

export class University {
  readonly id: string;

  readonly name: string;

  readonly codes: string[];

  readonly country: CountryCode;

  readonly domains: string[];

  readonly parent?: string;

  readonly campus: Campus[];

  readonly timezone: string;

  readonly admissionStart: Date;

  readonly admissionEnd: Date;

  readonly openServiceDate: Date;

  readonly closeServiceDate: Date;

  readonly website?: string;

  readonly pairingMode: PairingMode;

  readonly maxTandemsPerUser: number;

  readonly notificationEmail?: string;

  readonly specificLanguagesAvailable: Language[];

  constructor(props: UniversityProps) {
    this.id = props.id;
    this.name = props.name;
    this.parent = props.parent;
    this.codes = props.codes;
    this.country = props.country;
    this.campus = props.campus;
    this.domains = props.domains;
    this.timezone = props.timezone;
    this.admissionStart = props.admissionStart;
    this.admissionEnd = props.admissionEnd;
    this.openServiceDate = props.openServiceDate;
    this.closeServiceDate = props.closeServiceDate;
    this.website = props.website;
    this.pairingMode = props.pairingMode || PairingMode.MANUAL;
    this.maxTandemsPerUser = props.maxTandemsPerUser;
    this.notificationEmail = props.notificationEmail;
    this.specificLanguagesAvailable = props.specificLanguagesAvailable || [];
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }

  public isCentralUniversity(): boolean {
    return !this.parent;
  }

  public supportLanguage(
    language: Language,
    learningType?: LearningType,
  ): boolean {
    if (!this.isCentralUniversity() && language.secondaryUniversityActive) {
      return true;
    } else if (
      this.isCentralUniversity() &&
      language.mainUniversityStatus === LanguageStatus.PRIMARY
    ) {
      return true;
    } else if (
      this.isCentralUniversity() &&
      language.mainUniversityStatus === LanguageStatus.SECONDARY &&
      learningType !== LearningType.ETANDEM
    ) {
      return true;
    }

    return false;
  }
}
