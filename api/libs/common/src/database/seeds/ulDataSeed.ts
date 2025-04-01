/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';
import { UniversitySeedIDs } from './universities';
import { ObjectiveIds } from './objective';
import {
  AvailabilitesOptions,
  LearningType,
  MeetingFrequency,
} from '../../../../../src/core/models';

const enumValue = <T>(_enum: unknown): T => {
  const entries = Object.entries(_enum).map(([, v]) => v.toUpperCase());
  return faker.helpers.arrayElement(entries) as T;
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const rawData = require('./ulData.json');

export const insertUlData = async (prisma: Prisma.PrismaClient) => {
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
      email: `${item.firstname.toLowerCase()}.${item.lastname.toLowerCase()}@ul.com`,
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
        objectiveId = ObjectiveIds.WRITING_PRACTICE;
        break;
      case 'DISCOVER_CULTURE':
        objectiveId = ObjectiveIds.DISCOVER_CULTURE;
        break;
      case 'DISCOVER_LANGUAGE':
        objectiveId = ObjectiveIds.DISCOVER_LANGUAGE;
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
      meeting_frequency: faker.helpers.arrayElement(
        Object.entries(MeetingFrequency).map(([, v]) => v.toUpperCase()),
      ),
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
