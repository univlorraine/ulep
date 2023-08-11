import * as Prisma from '@prisma/client';
import { University } from 'src/core/models';
import { campusMapper } from './campus.mapper';

export const UniversityRelations = {
  Places: true,
  Languages: true,
};

export type UniversitySnapshot = Prisma.Organizations & {
  Places: Prisma.Places[];
  Languages: Prisma.LanguageCodes[];
};

export const universityMapper = (snapshot: UniversitySnapshot): University => {
  return new University({
    id: snapshot.id,
    name: snapshot.name,
    parent: snapshot.parent_id,
    campus: snapshot.Places.map((place) => campusMapper(place)),
    timezone: snapshot.timezone,
    languages: snapshot.Languages.map((language) => {
      return {
        id: language.id,
        code: language.code,
        name: language.name,
      };
    }),
    admissionStart: snapshot.admissionStartDate,
    admissionEnd: snapshot.admissionEndDate,
    website: snapshot.website,
    resourcesUrl: snapshot.resource,
  });
};
