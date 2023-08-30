import { CountryCode } from 'src/core/models/country-code.model';
import { Campus } from './campus.model';

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
  resourcesUrl?: string;
  confidentialityUrl?: string;
  termsOfUseUrl?: string;
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

  readonly resourcesUrl?: string;

  readonly confidentialityUrl?: string;

  readonly termsOfUseUrl?: string;

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
    this.resourcesUrl = props.resourcesUrl;
    this.confidentialityUrl = props.confidentialityUrl;
    this.termsOfUseUrl = props.termsOfUseUrl;
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }

  public isCentralUniversity(): boolean {
    return !this.parent;
  }
}
