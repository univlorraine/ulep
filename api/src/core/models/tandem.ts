import { DomainError } from '../errors/errors';
import { Profile } from './profile';

export type CreateTandemProps = {
  id: string;
  profiles: Profile[];
  startDate: Date;
  endDate: Date;
};

export class Tandem {
  #id: string;
  #profiles: Profile[];
  #startDate: Date;
  #endDate: Date;

  constructor(props: CreateTandemProps) {
    if (props.endDate < props.startDate) {
      throw new Error('End date must be after start date');
    }

    this.#id = props.id;
    this.profiles = props.profiles;
    this.#startDate = props.startDate;
    this.#endDate = props.endDate;
  }

  static create(props: CreateTandemProps): Tandem {
    return new Tandem(props);
  }

  get id(): string {
    return this.#id;
  }

  set profiles(profiles: Profile[]) {
    if (profiles.length !== 2) {
      throw new DomainError('Tandem must have exactly two profiles');
    }

    if (profiles[0].id === profiles[1].id) {
      throw new DomainError('Tandem must have two different profiles');
    }

    if (
      profiles[0].learningLanguage.code !== profiles[1].nativeLanguage.code ||
      profiles[1].learningLanguage.code !== profiles[0].nativeLanguage.code
    ) {
      throw new DomainError(
        'Leanring language and native language missmatch between profiles',
      );
    }

    this.#profiles = profiles;
  }

  get profiles(): Profile[] {
    return this.#profiles;
  }

  set startDate(startDate: Date) {
    if (startDate > this.#endDate) {
      throw new DomainError('Start date must be before end date');
    }

    this.#startDate = startDate;
  }

  get startDate(): Date {
    return this.#startDate;
  }

  set endDate(endDate: Date) {
    if (endDate < this.#startDate) {
      throw new DomainError('End date must be after start date');
    }

    this.#endDate = endDate;
  }

  get endDate(): Date {
    return this.#endDate;
  }
}
