import { PrismaClient } from '@prisma/client';

export const createUniversities = async (prisma: PrismaClient) => {
  await prisma.organization.create({
    data: {
      name: 'Université de Lorraine',
      country: { connect: { code: 'FR' } },
      timezone: 'Europe/Paris',
      admissionStart: new Date('2023-01-01'),
      admissionEnd: new Date('2023-12-31'),
    },
  });
};
