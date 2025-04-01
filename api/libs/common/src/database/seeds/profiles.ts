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
          specificProgram: faker.datatype.boolean(),
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

    let testedLanguages = [];
    if (index % 5 === 0) {
      testedLanguages = faker.helpers
        .arrayElements(
          languages.filter(
            (language) =>
              language.code !== nativeLanguageCode &&
              !learningLanguages.some(
                (learningLanguage) =>
                  learningLanguage.language.code === language.code,
              ),
          ),
          { min: 1, max: 3 },
        )
        .map((language) => ({
          language: language,
          level: enumValue(ProficiencyLevel),
        }));
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
        TestedLanguages: {
          create: testedLanguages.map((testedLanguage) => ({
            language_code_id: testedLanguage.language.id,
            level: testedLanguage.level,
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
              specific_program: learningLanguage.specificProgram,
              Campus: learningLanguage.campus && {
                connect: { id: learningLanguage.campus.id },
              },
            };
          }),
        },
        meeting_frequency: instance.meetingFrequency,
        availabilities: JSON.stringify(instance.availabilities),
        availabilities_note: instance.availabilitiesNote,
        availabilities_note_privacy: instance.availabilitiesNotePrivacy,
        bio: instance.biography,
      },
    });
  }
};
