import { PrismaClient } from '@prisma/client';
import { PairingMode } from '../../../../../src/core/models';

export const createCentralUniversityPlaceholder = async (
  prisma: PrismaClient,
) => {
  const countries = await prisma.countryCodes.findMany();
  const now = new Date();

  await prisma.organizations.create({
    data: {
      name: 'Central university',
      Country: {
        connect: { id: countries.find((country) => country.code === 'FR').id },
      },
      timezone: 'Europe/Paris',
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
    },
  });
};

export enum UniversitySeedIDs {
  CENTRAL = 'b511f9d1-ce7e-40b5-a630-ecb99f4e9f59',
  BIRMINGHAM = '60ea6e0d-e654-47bf-9bbf-58b3c375b339',
  FRANCFORT = '0747d187-7b02-479b-8ce3-faccac2a20c9',
  OTTAWA = '1d9f3c9f-0408-46a6-ba1e-b934a4be6b14',
}

export const createUniversities = async (prisma: PrismaClient) => {
  const countries = await prisma.countryCodes.findMany();
  const now = new Date();

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.CENTRAL,
      name: 'Université de Lorraine',
      Country: {
        connect: { id: countries.find((country) => country.code === 'FR').id },
      },
      Places: {
        create: [
          {
            id: '681fc6e9-52f6-43c5-8606-b119f7bb32b5',
            name: 'Campus principal',
          },
          {
            id: 'f2f19eeb-fdf6-46a4-a69d-3bc686f843cb',
            name: 'campus Strasbourg',
          },
        ],
      },
      codes: ['23LORRAINE'],
      domains: ['@univ-lorraine.fr'],
      timezone: 'Europe/Paris',
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.univ-lorraine.fr/',
      notification_email: 'notification+lorraine@test.fr',
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.BIRMINGHAM,
      name: 'Université de Birmingham',
      Country: {
        connect: { id: countries.find((country) => country.code === 'GB').id },
      },
      codes: ['23BIRMINGHAM'],
      domains: ['@univ-birmingham.fr'],
      timezone: 'Europe/London',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.birmingham.ac.uk',
      pairing_mode: PairingMode.SEMI_AUTOMATIC,
      notification_email: 'notification+birm@test.fr',
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.FRANCFORT,
      name: 'Université de Francfort',
      Country: {
        connect: { id: countries.find((country) => country.code === 'DE').id },
      },
      codes: ['23FRANCFORT'],
      domains: ['@univ-francfort.fr'],
      timezone: 'Europe/Berlin',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.toto.de',
      pairing_mode: PairingMode.AUTOMATIC,
    },
  });

  await prisma.organizations.create({
    data: {
      id: UniversitySeedIDs.OTTAWA,
      name: 'Université de Ottawa',
      Country: {
        connect: { id: countries.find((country) => country.code === 'CA').id },
      },
      codes: ['23OTTAWA'],
      domains: ['@univ-ottawa.ca', '@thetribe.io'],
      timezone: 'Canada/Atlantic',
      Parent: { connect: { id: UniversitySeedIDs.CENTRAL } },
      admissionStartDate: new Date(now.getFullYear(), 0, 1),
      admissionEndDate: new Date(now.getFullYear(), 11, 31),
      openServiceDate: new Date(now.getFullYear(), 0, 1),
      closeServiceDate: new Date(now.getFullYear(), 11, 31),
      website: 'https://www.toto.ca',
      pairing_mode: PairingMode.SEMI_AUTOMATIC,
    },
  });
};
