import * as Prisma from '@prisma/client';
import { CountryCode, CountryWithUniversities } from 'src/core/models';
import {
  UniversitySnapshot,
  universityMapper,
} from 'src/providers/persistance/mappers/university.mapper';

export type CountrySnapshot = Prisma.CountryCodes;

export type CountryWithUniversitiesSnapshot = Prisma.CountryCodes & {
  Organization: UniversitySnapshot[];
};

export const countryMapper = (country: CountrySnapshot): CountryCode => ({
  id: country.id,
  emoji: country.emoji,
  code: country.code,
  name: country.name,
  enable: country.enable,
});

export const countryWithUniversitiesMapper = (
  country: CountryWithUniversitiesSnapshot,
): CountryWithUniversities => ({
  ...countryMapper(country),
  universities: country.Organization.map(universityMapper),
});
