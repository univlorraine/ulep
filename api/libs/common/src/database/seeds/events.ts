import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';

export const createEvents = async (
  nbEventsPerUniversity: number,
  prisma: Prisma.PrismaClient,
): Promise<void> => {
  const universities = await prisma.organizations.findMany();
  const languages = await prisma.languageCodes.findMany({
    where: {
      secondaryUniversityActive: true,
    },
  });

  for (const university of universities) {
    for (let i = 0; i < nbEventsPerUniversity; i++) {
      const universityId = university.id;
      const title = faker.lorem.sentence();
      const content = faker.lorem.paragraph();
      const status = faker.helpers.arrayElement(['DRAFT', 'READY']);
      const type = faker.helpers.arrayElement(['ONLINE', 'PRESENTIAL']);

      let event_url;
      let address;
      let address_name;
      let deepLink;
      if (type === 'PRESENTIAL') {
        address = faker.location.streetAddress();
        address_name = faker.location.streetAddress();
        deepLink = `https://www.google.com/maps?api=1&q=${faker.location.latitude()},${faker.location.longitude()}`;
      } else {
        event_url = `https://www.google.com/maps?api=1&q=${faker.location.latitude()},${faker.location.longitude()}`;
      }

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

      await prisma.events.create({
        data: {
          DiffusionLanguages: {
            connect: faker.helpers
              .arrayElements(languages, {
                min: 1,
                max: 2,
              })
              .map((language) => ({
                id: language.id,
              })),
          },
          AuthorUniversity: {
            connect: {
              id: universityId,
            },
          },
          ConcernedUniversities: {
            connect: faker.helpers
              .arrayElements(universities, {
                min: 1,
                max: 3,
              })
              .map((university) => ({
                id: university.id,
              })),
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
          type: type,
          start_date: new Date(),
          end_date: faker.date.soon({ days: 14 }),
          event_url: event_url,
          address: address,
          address_name: address_name,
          deep_link: deepLink,
          with_subscription: faker.datatype.boolean({ probability: 0.8 }),
        },
      });
    }
  }
};
