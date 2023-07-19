import { PrismaClient } from '@prisma/client';

export const createUniversities = async (prisma: PrismaClient) => {
  await prisma.university.create({
    data: {
      name: 'Université de Lorraine',
      languages: {
        create: [{ languageCode: 'FR' }, { languageCode: 'EN' }],
      },
      timezone: 'Europe/Paris',
      admissionStart: new Date('2023-01-01'),
      admissionEnd: new Date('2023-12-31'),
    },
  });
};
