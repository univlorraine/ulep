import * as Prisma from '@prisma/client';
import { Country } from 'src/core/models/country';

export const countryMapper = (instance: Prisma.CountryCode): Country => {
  return new Country({
    id: instance.id,
    name: instance.name,
    code: instance.code,
  });
};
