import { v4 } from 'uuid';
import { Country } from './country';
import { Organization } from '@prisma/client';

export interface CreateUniversityProps {
  name: string;
  timezone: string;
  country: Country;
  admissionStart: Date;
  admissionEnd: Date;
}

export class University implements Organization {
  id: string;

  name: string;

  country: Country;

  timezone: string;

  admissionStart: Date;

  admissionEnd: Date;

  createdAt: Date;

  static create(props: CreateUniversityProps): University {
    const id = v4();

    return { id, ...props, countryId: props.country.id, createdAt: new Date() };
  }

  get countryId(): string {
    return this.country.id;
  }
}
