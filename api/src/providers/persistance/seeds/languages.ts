import { PrismaClient } from '@prisma/client';

const languagesCodes = [
  { code: 'EN', name: 'English', isAvailable: true },
  { code: 'DE', name: 'German', isAvailable: true },
  { code: 'FR', name: 'French', isAvailable: true },
  { code: 'ZH', name: 'Chinese', isAvailable: false },
];

export const createLanguages = async (prisma: PrismaClient) => {
  for (const language of languagesCodes) {
    await prisma.language.create({ data: { ...language } });
  }
};
