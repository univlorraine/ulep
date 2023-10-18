import { PrismaClient } from '@prisma/client';

export enum ObjectiveIds {
  ORAL_PRACTICE = 'eaf9948e-3a55-473a-b1f7-6634eec2a621',
  WRITING_PRACTICE = 'ce567cf5-8b3b-42c5-b816-f9e0a6f5d7f8',
  DISCOVER_CULTURE = '889f9ffe-08b5-4bb2-bb57-48a84739d198',
  DISCOVER_LANGUAGE = 'b75a2c18-3026-431a-a0af-af3f30fd2f44',
  GET_CERTIFICATION = '49f3bb2d-75cb-4421-afef-2f4207722bdc',
}

const objectives = [
  {
    id: ObjectiveIds.DISCOVER_LANGUAGE,
    text: 'Découvrir une nouvelle langue',
    translations: [
      { code: 'en', content: 'Discover a new language' },
      { code: 'zh', content: '探索一门新语言' },
      { code: 'de', content: 'Eine neue Sprache entdecken' },
      { code: 'es', content: 'Descubrir otro idioma' },
    ],
  },
  {
    id: ObjectiveIds.DISCOVER_CULTURE,
    text: 'Découvrir une culture',
    translations: [
      { code: 'en', content: 'Discover a culture' },
      { code: 'zh', content: '探索一种文化' },
      { code: 'de', content: 'Eine Kultur entdecken' },
      { code: 'es', content: 'Descubrir una cultura' },
    ],
  },
  {
    id: ObjectiveIds.ORAL_PRACTICE,
    text: 'Améliorer mes compétences orales',
    translations: [
      { code: 'en', content: 'Improve my oral skills' },
      { code: 'zh', content: '改进我的口语能力' },
      { code: 'de', content: 'Meine mündlichen Fähigkeiten verbessern' },
      { code: 'es', content: 'Mejorar mis competencias orales' },
    ],
  },
  {
    id: ObjectiveIds.WRITING_PRACTICE,
    text: 'Améliorer mes compétences écrites',
    translations: [
      { code: 'en', content: 'Improve my written skills' },
      { code: 'zh', content: '改进我的写作能力' },
      { code: 'de', content: 'Meine schriftlichen Fähigkeiten verbessern' },
      { code: 'es', content: 'Mejorar mis competencias escritas' },
    ],
  },
  {
    id: ObjectiveIds.GET_CERTIFICATION,
    text: 'Obtenir un certificat (e)Tandem',
    translations: [
      { code: 'en', content: 'Receive an (e)Tandem certificate' },
      { code: 'zh', content: '获得一个(远程)语伴证书' },
      { code: 'de', content: 'Ein (e)Tandem-Zertifikat erhalten' },
      { code: 'es', content: 'Obtener un certificado de E-Tándem' },
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
