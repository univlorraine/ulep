import * as Prisma from '@prisma/client';
import { Country } from '../../../core/models/country';

export const countryMapper = (instance: Prisma.Country): Country => {
  return new Country({
    id: instance.id,
    name: instance.name,
    code: instance.code,
  });
};
