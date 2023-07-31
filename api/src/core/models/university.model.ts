import { Language } from './language.model';

export interface UniversityProps {
  id: string;
  name: string;
  parent?: string;
  campus: string[];
  languages: Language[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
  website?: string;
  resourcesUrl?: string;
}

export class University {
  #id: string;

  #name: string;

  #parent?: string;

  #campus: string[];

  #languages: Language[];

  #timezone: string;

  #admissionStart: Date;

  #admissionEnd: Date;

  #website?: string;

  #resourcesUrl?: string;

  constructor(props: UniversityProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#parent = props.parent;
    this.#campus = props.campus;
    this.#languages = props.languages;
    this.#timezone = props.timezone;
    this.#admissionStart = props.admissionStart;
    this.#admissionEnd = props.admissionEnd;
    this.#website = props.website;
    this.#resourcesUrl = props.resourcesUrl;
  }

  static create(props: UniversityProps): University {
    return new University({ ...props });
  }

  get id(): string {
    return this.#id;
  }

  set name(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  get parent(): string | undefined {
    return this.#parent;
  }

  get campus(): string[] {
    return this.#campus;
  }

  set languages(languages: Language[]) {
    this.#languages = languages;
  }

  get languages(): Language[] {
    return this.#languages;
  }

  get timezone(): string {
    return this.#timezone;
  }

  set admissionStart(admissionStart: Date) {
    this.#admissionStart = admissionStart;
  }

  get admissionStart(): Date {
    return this.#admissionStart;
  }

  set admissionEnd(admissionEnd: Date) {
    this.#admissionEnd = admissionEnd;
  }

  get admissionEnd(): Date {
    return this.#admissionEnd;
  }

  get website(): string | undefined {
    return this.#website;
  }

  get resourcesUrl(): string | undefined {
    return this.#resourcesUrl;
  }
}
