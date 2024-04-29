import { CountryCode } from 'src/core/models/country-code.model';
import { Campus } from './campus.model';
import { Language, LanguageStatus } from './language.model';
import { LearningType } from './profile.model';
import { MediaObject } from 'src/core/models/media.model';
import { UserRepresentation } from '@app/keycloak';

export enum PairingMode {
  MANUAL = 'MANUAL',
  SEMI_AUTOMATIC = 'SEMI_AUTOMATIC',
  AUTOMATIC = 'AUTOMATIC',
}

export interface UniversityProps {
  id: string;
  logo?: MediaObject;
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
  nativeLanguage: Language;
  defaultContactId: string;
}

export class University {
  readonly id: string;

  readonly logo?: MediaObject;

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

  readonly nativeLanguage: Language;

  readonly defaultContactId: string;

  constructor(props: UniversityProps) {
    this.id = props.id;
    this.admissionStart = props.admissionStart;
    this.admissionEnd = props.admissionEnd;
    this.campus = props.campus;
    this.closeServiceDate = props.closeServiceDate;
    this.codes = props.codes;
    this.country = props.country;
    this.domains = props.domains;
    this.logo = props.logo;
    this.maxTandemsPerUser = props.maxTandemsPerUser;
    this.name = props.name;
    this.notificationEmail = props.notificationEmail;
    this.openServiceDate = props.openServiceDate;
    this.pairingMode = props.pairingMode || PairingMode.MANUAL;
    this.parent = props.parent;
    this.specificLanguagesAvailable = props.specificLanguagesAvailable || [];
    this.timezone = props.timezone;
    this.website = props.website;
    this.nativeLanguage = props.nativeLanguage;
    this.defaultContactId = props.defaultContactId;
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
    } else if (
      this.specificLanguagesAvailable.find((l) => l.id === language.id)
    ) {
      return true;
    }

    return false;
  }
}

export class UniversityWithKeycloakContact extends University {
  readonly defaultContact?: UserRepresentation;

  constructor(
    props: UniversityProps & { defaultContact?: UserRepresentation },
  ) {
    super(props);
    this.defaultContact = props.defaultContact;
  }
}
