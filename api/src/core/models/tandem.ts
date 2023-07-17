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

  get id(): string {
    return this.#id;
  }

  set profiles(profiles: Profile[]) {
    if (profiles.length !== 2) {
      throw new Error('Tandem must have exactly two profiles');
    }

    this.#profiles = profiles;
  }

  get profiles(): Profile[] {
    return this.#profiles;
  }

  set startDate(startDate: Date) {
    if (startDate > this.#endDate) {
      throw new Error('Start date must be before end date');
    }

    this.#startDate = startDate;
  }

  get startDate(): Date {
    return this.#startDate;
  }

  set endDate(endDate: Date) {
    if (endDate < this.#startDate) {
      throw new Error('End date must be after start date');
    }

    this.#endDate = endDate;
  }

  get endDate(): Date {
    return this.#endDate;
  }
}
