import { PrismaClient } from '@prisma/client';

const objectives = [
  'Parler comme un natif',
  'Améliorer mon niveau',
  'S’entraîner à l’oral',
  'Preparer un séjour à l’etranger',
  'Obtenir une certification,',
];

export const createLearningObjectives = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (const objective of objectives) {
    await prisma.learningObjectives.create({
      data: {
        TextContent: {
          create: {
            text: objective,
            LanguageCode: { connect: { code: 'fr' } },
          },
        },
      },
    });
  }
};
