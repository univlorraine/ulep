import { CountryCode } from 'src/core/models/country-code.model';
import { Campus } from './campus.model';
import { Language, LanguageStatus } from './language.model';

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
  website?: string;
  pairingMode?: PairingMode;
  notificationEmail?: string;
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

  readonly website?: string;

  readonly pairingMode: PairingMode;

  readonly notificationEmail?: string;

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
    this.website = props.website;
    this.pairingMode = props.pairingMode || PairingMode.MANUAL;
    this.notificationEmail = props.notificationEmail;
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }

  public isCentralUniversity(): boolean {
    return !this.parent;
  }

  public supportLanguage(language: Language): boolean {
    if (!this.isCentralUniversity() && language.secondaryUniversityActive) {
      return true;
    } else if (
      this.isCentralUniversity() &&
      language.mainUniversityStatus === LanguageStatus.PRIMARY
    ) {
      return true;
    }

    return false;
  }
}
