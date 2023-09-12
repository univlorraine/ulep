import * as Prisma from '@prisma/client';
import { University } from 'src/core/models';
import { campusMapper } from './campus.mapper';
import { countryMapper } from 'src/providers/persistance/mappers/country.mapper';

export const UniversityRelations = {
  Country: true,
  Places: true,
};

export type UniversitySnapshot = Prisma.Organizations & {
  Country: Prisma.CountryCodes;
  Places: Prisma.Places[];
};

export const universityMapper = (snapshot: UniversitySnapshot): University => {
  return new University({
    id: snapshot.id,
    name: snapshot.name,
    country: countryMapper(snapshot.Country),
    parent: snapshot.parent_id,
    campus: snapshot.Places.map((place) => campusMapper(place)),
    codes: snapshot.codes,
    domains: snapshot.domains,
    timezone: snapshot.timezone,
    admissionStart: snapshot.admissionStartDate,
    admissionEnd: snapshot.admissionEndDate,
    website: snapshot.website,
  });
};
