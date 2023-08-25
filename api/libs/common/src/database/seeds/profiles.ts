import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { ProfileFactory } from '../factories';
import { LearningType, ProficiencyLevel } from '../../../../../src/core/models';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

export const createProfiles = async (
  count: number,
  prisma: Prisma.PrismaClient,
): Promise<void> => {
  const profileFactory = new ProfileFactory();

  //   masteredLanguages
  // learningLanguages
  // objectives
  // interests

  const languages = await prisma.languageCodes.findMany();
  const objectives = await prisma.learningObjectives.findMany();
  const interest = await prisma.interests.findMany();
  const universities = await prisma.organizations.findMany();
  // const [centralUniversity, partnerUniversities] = universities.reduce(
  //   (accumulator, university) => {
  //     if (university.parent_id) {
  //       accumulator[1].push(university);
  //     } else {
  //       accumulator[0] = university;
  //     }
  //     return accumulator;
  //   },
  //   [null, []],
  // );

  const users = await prisma.users.findMany({
    include: {
      Organization: {
        include: {
          Languages: true,
          Places: true,
        },
      },
      Nationality: true,
    },
    take: count,
  });

  for (const [index, user] of users.entries()) {
    const instance = profileFactory.makeOne();

    //   masteredLanguages
    // learningLanguages
    // objectives
    // interests

    let nativeLanguageCode;
    switch (user.Nationality.code) {
      case 'FR':
        nativeLanguageCode = 'fr';
        break;
      case 'EN':
        nativeLanguageCode = 'en';
        break;
      case 'DE':
        nativeLanguageCode = 'de';
        break;
      default:
        nativeLanguageCode = faker.helpers.arrayElement(languages).code;
        break;
    }

    const learningLanguages = faker.helpers
      .arrayElements(
        user.Organization.Languages.filter(
          (language) => language.code !== nativeLanguageCode,
        ),
      )
      .map((language) => ({
        language: language,
        level: enumValue(ProficiencyLevel),
      }));

    let masteredLanguages = [];
    if (index % 20 === 0) {
      // 1 of 20 spoke other languages
      masteredLanguages = faker.helpers.arrayElements(
        languages.filter(
          (language) =>
            language.code !== nativeLanguageCode &&
            !learningLanguages.some(
              (learningLanguage) =>
                learningLanguage.language.code === language.code,
            ),
        ),
        faker.number.int({ max: 3 }),
      );
    }

    const isCentralUniversity = !user.Organization.parent_id;
    const campus = isCentralUniversity
      ? faker.helpers.arrayElement(user.Organization.Places)
      : undefined;

    const learningType = isCentralUniversity
      ? faker.helpers.enumValue(LearningType)
      : LearningType.ETANDEM;

    await prisma.profiles.create({
      data: {
        User: { connect: { id: user.id } },
        NativeLanguage: { connect: { code: nativeLanguageCode } },
        MasteredLanguages: {
          create: masteredLanguages.map((language) => ({
            language_code_id: language.id,
          })),
        },
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
        learning_type: learningType,
        same_gender: instance.sameGender,
        same_age: instance.sameAge,
        meeting_frequency: instance.meetingFrequency,
        bio: instance.biography,
        Campus: campus && {
          connect: { id: campus.id },
        },
      },
    });
  }
};
