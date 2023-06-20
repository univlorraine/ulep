import * as Prisma from '@prisma/client';
import { University } from 'src/core/models/university';
import { countryMapper } from './country.mapper';

type OrganizationEntity = Prisma.Organization & {
  country: Prisma.CountryCode;
};

export const universityMapper = (instance: OrganizationEntity): University => {
  return new University({
    id: instance.id,
    name: instance.name,
    country: countryMapper(instance.country),
    timezone: instance.timezone,
    admissionStart: instance.admissionStart,
    admissionEnd: instance.admissionEnd,
  });
};
