import * as Prisma from '@prisma/client';
import { University } from '../../../core/models/university';

export type UniversitySnapshot = Prisma.University & {
  campuses: Prisma.Campus[];
  parent: Prisma.University | null;
  languages: (Prisma.UniversityLanguage & {
    language: Prisma.Language;
  })[];
};

export const universityMapper = (instance: UniversitySnapshot): University => {
  return new University({
    id: instance.id,
    name: instance.name,
    parent: instance.parentId,
    campus: instance.campuses.map((c) => c.name),
    timezone: instance.timezone,
    languages: instance.languages.map((l) => {
      return {
        name: l.language.name,
        code: l.language.code,
      };
    }),
    website: instance.website,
    admissionStart: instance.admissionStart,
    admissionEnd: instance.admissionEnd,
  });
};
