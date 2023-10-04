import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { UniversitySeedIDs } from './universities';
import { ObjectiveIds } from './objective';
import {
  AvailabilitesOptions,
  LearningType,
} from '../../../../../src/core/models';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rawData = require('./ulData.json');

export const generateData = async (prisma: Prisma.PrismaClient) => {
  const places = await prisma.places.findMany();
  const countries = await prisma.countryCodes.findMany();
  const languages = await prisma.languageCodes.findMany();
  const objectives = await prisma.learningObjectives.findMany();
  const interest = await prisma.interests.findMany();

  const unknownLanguageCodes = new Set<string>();

  const data = rawData.data;

  for (const item of data) {
    let universityId = UniversitySeedIDs.CENTRAL;
    if (item.university === 'OT') {
      universityId = UniversitySeedIDs.OTTAWA;
    }

    const countryWithLanguage = countries.find(
      (country) => country.code === item.native_language,
    );
    let nationalityCode = countryWithLanguage?.code;
    if (!countryWithLanguage) {
      if (item.native_language === 'EN') {
        nationalityCode = 'GB';
      } else {
        nationalityCode = 'PE';
      }
    }

    const user = {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      firstname: item.firstname,
      lastname: item.lastname,
      gender: item.gender,
      age: parseInt(item.age, 10),
      role: item.role,
      Organization: {
        connect: {
          id: universityId,
        },
      },
      Nationality: {
        connect: {
          code: nationalityCode,
        },
      },
    };

    let objectiveId = objectives[0].id;
    switch (item.goal) {
      case 'ORAL_PRACTICE':
        objectiveId = ObjectiveIds.ORAL_PRACTICE;
        break;
      case 'IMPROVE_LEVEL':
        objectiveId = ObjectiveIds.IMPROVE_LEVEL;
        break;
      case 'SPEAK_LIKE_NATIVE':
        objectiveId = ObjectiveIds.SPEAK_LIKE_NATIVE;
        break;
      case 'PREPARE_TRAVEL_ABROAD':
        objectiveId = ObjectiveIds.PREPARE_TRAVEL_ABROAD;
        break;
      case 'GET_CERTIFICATION':
        objectiveId = ObjectiveIds.GET_CERTIFICATION;
        break;
    }

    const isCentralUniversity = universityId === UniversitySeedIDs.CENTRAL;
    const tmpDate = item.registered_at.split('/');
    const registerDate = new Date(
      `${tmpDate[2]}-${tmpDate[1]}-${tmpDate[0]}T00:00:00`,
    );

    if (
      !languages.some((l) => l.code === item.learning_language.toLowerCase())
    ) {
      unknownLanguageCodes.add(item.learning_language);
    }

    const learningLanguage = {
      LanguageCode: {
        connect: { code: item.learning_language.toLowerCase() },
      },
      level: item.level,
      created_at: registerDate,
      learning_type: isCentralUniversity
        ? faker.helpers.enumValue(LearningType)
        : LearningType.ETANDEM,
      Campus: isCentralUniversity
        ? {
            connect: {
              id: faker.helpers.arrayElement(places).id,
            },
          }
        : undefined,
      same_gender: item.same_gender === '1',
      same_age: faker.datatype.boolean(),
      specific_program: faker.datatype.boolean(),
      certificate_option: faker.datatype.boolean(),
    };

    let nativeLanguage = item.native_language.toLowerCase();
    if (!languages.some((l) => l.code === nativeLanguage)) {
      nativeLanguage = 'en';
      unknownLanguageCodes.add(item.native_language);
    }

    const profile = {
      id: faker.string.uuid(),
      User: { connect: { id: user.id } },
      NativeLanguage: { connect: { code: nativeLanguage } },
      Goals: {
        connect: [
          {
            id: objectiveId,
          },
        ],
      },
      Interests: {
        connect: faker.helpers.arrayElements(interest, 2).map((it) => ({
          id: it.id,
        })),
      },
      LearningLanguages: {
        create: [learningLanguage],
      },
      meeting_frequency: faker.helpers.arrayElement([
        'ONCE_A_WEEK',
        'TWICE_A_WEEK',
        'ONCE_A_MONTH',
        'TWICE_A_MONTH',
      ]),
      availabilities: JSON.stringify({
        monday: enumValue(AvailabilitesOptions),
        tuesday: enumValue(AvailabilitesOptions),
        wednesday: enumValue(AvailabilitesOptions),
        thursday: enumValue(AvailabilitesOptions),
        friday: enumValue(AvailabilitesOptions),
        saturday: enumValue(AvailabilitesOptions),
        sunday: enumValue(AvailabilitesOptions),
      }),
      availabilities_note: faker.lorem.sentence(),
      availabilities_note_privacy: faker.datatype.boolean(),
      bio: {
        superpower: faker.lorem.sentence(),
        favoritePlace: faker.lorem.sentence(),
        experience: faker.lorem.sentence(),
        anecdote: faker.lorem.sentence(),
      },
    };

    await prisma.users.create({
      data: user,
    });

    await prisma.profiles.create({
      data: profile,
    });
  }

  console.log('Unknown languages', unknownLanguageCodes);
};
