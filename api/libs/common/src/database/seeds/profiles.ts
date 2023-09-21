import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { ProfileFactory } from '../factories';
import { LanguageStatus } from '../../../../../src/core/models';
import { LearningType, ProficiencyLevel } from '../../../../../src/core/models';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

export const createProfiles = async (
  prisma: Prisma.PrismaClient,
): Promise<void> => {
  const profileFactory = new ProfileFactory();

  const languages = await prisma.languageCodes.findMany();
  const objectives = await prisma.learningObjectives.findMany();
  const interest = await prisma.interests.findMany();

  const users = await prisma.users.findMany({
    include: {
      Organization: {
        include: {
          Places: true,
        },
      },
      Nationality: true,
    },
  });

  for (const [index, user] of users.entries()) {
    const instance = profileFactory.makeOne();

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
        languages.filter(
          (language) =>
            language.code !== nativeLanguageCode &&
            language.mainUniversityStatus === LanguageStatus.PRIMARY,
        ),
        { min: 1, max: 3 },
      )
      .map((language) => {
        const isCentralUniversity = !user.Organization.parent_id;
        const campus = isCentralUniversity
          ? faker.helpers.arrayElement(user.Organization.Places)
          : undefined;
        const learningType = isCentralUniversity
          ? faker.helpers.enumValue(LearningType)
          : LearningType.ETANDEM;

        return {
          language: language,
          level: enumValue(ProficiencyLevel),
          createdAt: faker.date.between({
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 168),
            to: new Date(),
          }),
          campus,
          learningType,
          sameGender: faker.datatype.boolean(),
          sameAge: faker.datatype.boolean(),
        };
      });

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
        { min: 1, max: 3 },
      );
    }

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
              created_at: learningLanguage.createdAt,
              learning_type: learningLanguage.learningType,
              same_gender: learningLanguage.sameGender,
              same_age: learningLanguage.sameAge,
              Campus: learningLanguage.campus && {
                connect: { id: learningLanguage.campus.id },
              },
            };
          }),
        },
        meeting_frequency: instance.meetingFrequency,
        availabilities: JSON.stringify(instance.availabilities),
        availabilities_note: instance.availabilitiesNote,
        availabilities_note_privacy: instance.availavilitiesNotePrivacy,
        bio: instance.biography,
      },
    });
  }
};
