import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { ProfileFactory } from '../factories';

const mapCountryCodeToLanguageCode = (countryCode: string): string => {
  switch (countryCode) {
    case 'DE':
      return 'de';
    case 'FR':
      return 'fr';
    case 'CN':
      return 'zh';
    default:
      return 'en';
  }
};

export const createProfiles = async (
  count: number,
  prisma: Prisma.PrismaClient,
): Promise<void> => {
  const profileFactory = new ProfileFactory();

  const users = await prisma.users.findMany({
    include: {
      Organization: { include: { Languages: true } },
    },
    take: count,
  });
  const countries = await prisma.countryCodes.findMany();
  const objectives = await prisma.learningObjectives.findMany();
  const interest = await prisma.interests.findMany();

  for (const user of users) {
    const instance = profileFactory.makeOne();

    const nativeLanguageCode = mapCountryCodeToLanguageCode(
      faker.helpers.arrayElement(countries).code,
    );

    const availableLanguagesCodes = user.Organization.Languages.filter(
      (language) => language.code !== nativeLanguageCode,
    );

    await prisma.profiles.create({
      data: {
        User: { connect: { id: user.id } },
        NativeLanguage: { connect: { code: nativeLanguageCode } },
        // MasteredLanguages: {},
        Goals: {
          connect: faker.helpers.arrayElements(objectives, 2).map((it) => ({
            id: it.id,
          })),
        },
        Interests: {
          connect: faker.helpers.arrayElements(interest, 2).map((it) => ({
            id: it.id,
          })),
        },
        LearningLanguages: {
          create: instance.learningLanguages.map((learningLanguage) => {
            return {
              LanguageCode: {
                connect: { code: learningLanguage.language.code },
              },
              level: learningLanguage.level,
            };
          }),
        },
        learning_type: instance.learningType,
        same_gender: instance.sameGender,
        same_age: instance.sameAge,
        meeting_frequency: instance.meetingFrequency,
        bio: instance.biography,
      },
    });
  }
};
