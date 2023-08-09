import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { ProfileFactory } from '../factories';
import { ProficiencyLevel } from '../../../../../src/core/models';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

const FRENCH_LANGUAGE_CODE = 'fr';
const ENGLISH_LANGUAGE_CODE = 'en';

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
  const languages = await prisma.languageCodes.findMany();
  const objectives = await prisma.learningObjectives.findMany();
  const interest = await prisma.interests.findMany();

  for (const [index, user] of users.entries()) {
    const instance = profileFactory.makeOne();

    let nativeLanguageCode = faker.helpers.arrayElement(languages).code;
    const availableLanguages = user.Organization.Languages.filter(
      (language) => language.code !== nativeLanguageCode.toLowerCase(),
    );
    let learningLanguages = faker.helpers
      .arrayElements(availableLanguages)
      .map((learningLanguage) => ({
        language: learningLanguage,
        level: enumValue(ProficiencyLevel),
      }));

    if (index % 10 === 0) {
      // Force one of 10 learning french
      const frenchLanguage = availableLanguages.find(
        (language) => language.code === FRENCH_LANGUAGE_CODE,
      );
      learningLanguages = [
        {
          language: frenchLanguage,
          level: enumValue(ProficiencyLevel),
        },
      ];
    } else if (index % 4 === 0) {
      // Force on of 4 to be french
      nativeLanguageCode = FRENCH_LANGUAGE_CODE;
      learningLanguages = learningLanguages.filter(
        (learningLanguage) =>
          learningLanguage.language.code !== FRENCH_LANGUAGE_CODE,
      );
      if (learningLanguages.length === 0) {
        const englishLanguage = availableLanguages.find(
          (language) => language.code === ENGLISH_LANGUAGE_CODE,
        );
        learningLanguages = [
          {
            language: englishLanguage,
            level: enumValue(ProficiencyLevel),
          },
        ];
      }
    }

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
          create: learningLanguages.map((learningLanguage) => {
            return {
              LanguageCode: {
                connect: { code: learningLanguage.language.code },
              },
              level: learningLanguage.level as ProficiencyLevel,
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
