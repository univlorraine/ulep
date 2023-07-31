import { PrismaClient } from '@prisma/client';

export const createUniversities = async (prisma: PrismaClient) => {
  await prisma.organizations.create({
    data: {
      name: 'Université de Lorraine',
      Languages: {
        connect: [{ code: 'fr' }, { code: 'en' }],
      },
      timezone: 'Europe/Paris',
      admissionStartDate: new Date('2023-01-01'),
      admissionEndDate: new Date('2023-12-31'),
      website: 'https://www.univ-lorraine.fr/',
      resource: 'https://www.univ-lorraine.fr/ulep',
    },
  });
};
