import { PrismaClient } from '@prisma/client';

const objectives = [
  {
    text: 'Parler comme un natif',
    translations: [
      { code: 'en', content: 'Speak like a native' },
      { code: 'zh', content: '像本地人一样说话' },
    ],
  },
  {
    text: 'Améliorer mon niveau',
    translations: [
      { code: 'en', content: 'Improve my level' },
      { code: 'zh', content: '提高我的水平' },
    ],
  },
  {
    text: 'S’entraîner à l’oral',
    translations: [
      { code: 'en', content: 'Oral training' },
      { code: 'zh', content: '口语培训' },
    ],
  },
  {
    text: 'Preparer un séjour à l’etranger',
    translations: [
      { code: 'en', content: 'Preparing a trip abroad' },
      { code: 'zh', content: '准备出国旅行' },
    ],
  },
  {
    text: 'Obtenir une certification',
    translations: [
      { code: 'en', content: 'Obtaining certification' },
      { code: 'zh', content: '获得认证' },
    ],
  },
];

export const createLearningObjectives = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (const objective of objectives) {
    await prisma.learningObjectives.create({
      data: {
        TextContent: {
          create: {
            text: objective.text,
            Translations: {
              create: objective.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.code } },
              })),
            },
            LanguageCode: { connect: { code: 'fr' } },
          },
        },
      },
    });
  }
};
