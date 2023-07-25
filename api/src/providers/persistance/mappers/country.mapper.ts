import * as Prisma from '@prisma/client';
import { Country } from '../../../core/models/country';

export const countryMapper = (instance: Prisma.Country): Country => {
  return { code: instance.code, name: instance.name };
};
