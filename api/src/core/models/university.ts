import { v4 } from 'uuid';
import { Country } from './country';

export interface UniversityProps {
  name: string;
  timezone: string;
  country: Country;
  admissionStart: Date;
  admissionEnd: Date;
}

export class University {
  #id: string;

  #name: string;

  #country: Country;

  #timezone: string;

  #admissionStart: Date;

  #admissionEnd: Date;

  constructor(props: { id: string } & UniversityProps) {
    this.#id = props.id;
    this.#name = props.name;
    this.#country = props.country;
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

  get country(): Country {
    return this.#country;
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
