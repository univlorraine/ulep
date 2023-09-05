import { PrismaClient } from '@prisma/client';

const categoryReports = [
  {
    text: 'Signaler un comportement',
    translations: [
      { code: 'en', content: 'Report behavior' },
      { code: 'zh', content: '报告行为' },
    ],
  },
  {
    text: 'Suggestion',
    translations: [
      { code: 'en', content: 'Suggestion' },
      { code: 'zh', content: '建议' },
    ],
  },
  {
    text: 'Autre',
    translations: [
      { code: 'en', content: 'Other' },
      { code: 'zh', content: '其他' },
    ],
  },
];

export const createReportCategories = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (const category of categoryReports) {
    await prisma.reportCategories.create({
      data: {
        TextContent: {
          create: {
            text: category.text,
            Translations: category.translations
              ? {
                  create: category.translations?.map((translation) => ({
                    text: translation.content,
                    LanguageCode: { connect: { code: translation.code } },
                  })),
                }
              : undefined,
            LanguageCode: { connect: { code: 'fr' } },
          },
        },
      },
    });
  }
};
