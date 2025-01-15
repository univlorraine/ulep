import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';

export const createNews = async (
  nbNewsPerUniversity: number,
  prisma: Prisma.PrismaClient,
): Promise<void> => {
  const universities = await prisma.organizations.findMany();

  for (const university of universities) {
    for (let i = 0; i < nbNewsPerUniversity; i++) {
      const universityId = university.id;
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const status = faker.helpers.arrayElement(['DRAFT', 'READY']);
      const translations = [
        {
          languageCode: 'es',
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
        },
        {
          languageCode: 'en',
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
        },
      ];

      await prisma.news.create({
        data: {
          Organization: {
            connect: {
              id: universityId,
            },
          },
          TitleTextContent: {
            create: {
              text: title,
              LanguageCode: { connect: { code: 'fr' } },
              Translations: {
                create: translations.map((translation) => ({
                  text: translation.title,
                  LanguageCode: { connect: { code: translation.languageCode } },
                })),
              },
            },
          },
          ContentTextContent: {
            create: {
              text: content,
              LanguageCode: { connect: { code: 'fr' } },
              Translations: {
                create: translations.map((translation) => ({
                  text: translation.content,
                  LanguageCode: { connect: { code: translation.languageCode } },
                })),
              },
            },
          },
          status: status,
          start_publication_date: new Date(),
          end_publication_date: faker.date.soon({ days: 14 }),
        },
      });
    }
  }
};
