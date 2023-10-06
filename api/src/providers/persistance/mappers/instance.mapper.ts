import * as Prisma from '@prisma/client';
import { Instance } from 'src/core/models/Instance';

export type InstanceSnapshot = Prisma.Instance;

export const instanceMapper = (instanceSnapshot: InstanceSnapshot) => {
  return new Instance({
    id: instanceSnapshot.id,
    name: instanceSnapshot.name,
    email: instanceSnapshot.email,
    ressourceUrl: instanceSnapshot.ressource_url,
    cguUrl: instanceSnapshot.cgu_url,
    confidentialityUrl: instanceSnapshot.confidentiality_url,
    primaryColor: instanceSnapshot.primary_color,
    primaryBackgroundColor: instanceSnapshot.primary_background_color,
    primaryDarkColor: instanceSnapshot.primary_dark_color,
    secondaryColor: instanceSnapshot.secondary_color,
    secondaryBackgroundColor: instanceSnapshot.secondary_background_color,
    secondaryDarkColor: instanceSnapshot.secondary_dark_color,
  });
};
