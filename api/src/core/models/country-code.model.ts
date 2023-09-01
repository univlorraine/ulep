import { University } from 'src/core/models/university.model';

export class CountryCode {
  id: string;
  code: string;
  name: string;
  emoji: string;
  enable: boolean;
}

export interface CountryWithUniversities extends CountryCode {
  universities: University[];
}
