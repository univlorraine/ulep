import { v4 } from 'uuid';
import { Language } from './language';

export interface UniversityProps {
  name: string;
  website?: string;
  parent?: string;
  campus: string[];
  languages: Language[];
  timezone: string;
  admissionStart: Date;
  admissionEnd: Date;
}

export class University {
  #id: string;

  #name: string;

  #website?: string;

  #parent?: string;

  #campus: string[];

  #languages: Language[];

  #timezone: string;

  #admissionStart: Date;

  #admissionEnd: Date;

  constructor(props: { id: string } & UniversityProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#website = props.website;
    this.#parent = props.parent;
    this.#campus = props.campus;
    this.#languages = props.languages;
    this.#timezone = props.timezone;
    this.#admissionStart = props.admissionStart;
    this.#admissionEnd = props.admissionEnd;
  }

  static create(props: UniversityProps): University {
    const id = v4();

    return new University({ id, ...props });
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

  get website(): string | undefined {
    return this.#website;
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
}
