import { Campus } from './campus.model';
import { Language } from './language.model';

export interface UniversityProps {
  id: string;
  name: string;
  parent?: string;
  campus: Campus[];
  languages: Language[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  website?: string;
  resourcesUrl?: string;
}

export class University {
  readonly id: string;

  readonly name: string;

  readonly parent?: string;

  readonly campus: Campus[];

  readonly languages: Language[];

  readonly timezone: string;

  readonly admissionStart: Date;

  readonly admissionEnd: Date;

  readonly website?: string;

  readonly resourcesUrl?: string;

  constructor(props: UniversityProps) {
    this.id = props.id;
    this.name = props.name;
    this.parent = props.parent;
    this.campus = props.campus;
    this.languages = props.languages;
    this.timezone = props.timezone;
    this.admissionStart = props.admissionStart;
    this.admissionEnd = props.admissionEnd;
    this.website = props.website;
    this.resourcesUrl = props.resourcesUrl;
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }
}
