import { PrismaClient } from '@prisma/client';

export const languagesCodes = [
  { code: 'EN', name: 'English' },
  { code: 'DE', name: 'German' },
  { code: 'FR', name: 'French' },
  { code: 'ZH', name: 'Chinese' },
];

export const createLanguages = async (prisma: PrismaClient) => {
  for (const language of languagesCodes) {
    await prisma.language.create({ data: { ...language } });
  }
};
