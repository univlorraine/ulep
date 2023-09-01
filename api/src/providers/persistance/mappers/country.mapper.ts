import * as Prisma from '@prisma/client';
import { CountryCode } from 'src/core/models';

export type CountrySnapshot = Prisma.CountryCodes;

export const countryMapper = (country: CountrySnapshot): CountryCode => ({
  id: country.id,
  emoji: country.emoji,
  code: country.code,
  name: country.name,
  enable: country.enable,
});
