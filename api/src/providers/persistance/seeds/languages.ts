import { PrismaClient } from '@prisma/client';

const languagesCodes = [
  { code: 'EN', name: 'English', isEnable: true },
  { code: 'DE', name: 'German', isEnable: true },
  { code: 'FR', name: 'French', isEnable: true },
  { code: 'ZH', name: 'Chinese', isEnable: false },
];

export const createLanguages = async (prisma: PrismaClient) => {
  for (const language of languagesCodes) {
    await prisma.languageCode.create({
      data: { code: language.code, name: language.name },
    });
  }
};
