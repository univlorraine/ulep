import { PrismaClient } from '@prisma/client';

export enum ObjectiveIds {
  ORAL_PRACTICE = 'eaf9948e-3a55-473a-b1f7-6634eec2a621',
  IMPROVE_LEVEL = '889f9ffe-08b5-4bb2-bb57-48a84739d198',
  SPEAK_LIKE_NATIVE = 'b75a2c18-3026-431a-a0af-af3f30fd2f44',
  PREPARE_TRAVEL_ABROAD = 'ce567cf5-8b3b-42c5-b816-f9e0a6f5d7f8',
  GET_CERTIFICATION = '49f3bb2d-75cb-4421-afef-2f4207722bdc',
}

const objectives = [
  {
    id: ObjectiveIds.SPEAK_LIKE_NATIVE,
    text: 'Parler comme un natif',
    translations: [
      { code: 'en', content: 'Speak like a native' },
      { code: 'zh', content: '像本地人一样说话' },
    ],
  },
  {
    id: ObjectiveIds.IMPROVE_LEVEL,
    text: 'Améliorer mon niveau',
    translations: [
      { code: 'en', content: 'Improve my level' },
      { code: 'zh', content: '提高我的水平' },
    ],
  },
  {
    id: ObjectiveIds.ORAL_PRACTICE,
    text: 'S’entraîner à l’oral',
    translations: [
      { code: 'en', content: 'Oral training' },
      { code: 'zh', content: '口语培训' },
    ],
  },
  {
    id: ObjectiveIds.PREPARE_TRAVEL_ABROAD,
    text: 'Preparer un séjour à l’etranger',
    translations: [
      { code: 'en', content: 'Preparing a trip abroad' },
      { code: 'zh', content: '准备出国旅行' },
    ],
  },
  {
    id: ObjectiveIds.GET_CERTIFICATION,
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
        id: objective.id,
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
