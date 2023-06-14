import { CountryCode } from '@prisma/client';
import { v4 } from 'uuid';

export interface CreateCountryProps {
  name: string;
  code: string;
}

export class Country implements CountryCode {
  id: string;
  code: string;
  name: string;
  createdAt: Date;

  static create(props: CreateCountryProps): Country {
    const id = v4();
    return { id, ...props, createdAt: new Date() };
  }
}
