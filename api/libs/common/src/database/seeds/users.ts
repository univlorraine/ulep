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

const foreignCountriesCodes = ['DE', 'GB'];

export const createUsers = async (
  nbUserCentralUniversity: number,
  nbUserPartnersUniversity: number,
  prisma: Prisma.PrismaClient,
): Promise<Prisma.Users[]> => {
  const users: Prisma.Users[] = [];

  const universities = await prisma.organizations.findMany();
  const [centralUniversity, partnerUniversities] = universities.reduce(
    (accumulator, university) => {
      if (university.parent_id) {
        accumulator[1].push(university);
      } else {
        accumulator[0] = university;
      }
      return accumulator;
    },
    [null, []],
  );

  for (let i = 0; i < nbUserCentralUniversity; i++) {
    const universityId = centralUniversity.id;

    let nationality = 'FR';
    if (i % 5 === 0) {
      // 1 of 5 doesn't have french nationality
      nationality = faker.helpers.arrayElement(foreignCountriesCodes);
    }

    const user = await prisma.users.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
        age: faker.number.int({ min: 16, max: 64 }),
        role: faker.helpers.arrayElement(['STUDENT', 'STAFF']),
        Organization: {
          connect: {
            id: universityId,
          },
        },
        Nationality: {
          connect: {
            code: nationality,
          },
        },
      },
    });

    users.push(user);
  }

  for (let i = 0; i < nbUserPartnersUniversity; i++) {
    const universityId = faker.helpers.arrayElement(partnerUniversities).id;

    let nationality = 'FR';
    switch (universityId) {
      case UniversitySeedIDs.FRANCFORT:
        nationality = 'DE';
        break;
      case UniversitySeedIDs.BIRMINGHAM:
        nationality = 'GB';
        break;
    }

    const user = await prisma.users.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        gender: faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']),
        age: faker.number.int({ min: 16, max: 64 }),
        role: faker.helpers.arrayElement(['STUDENT', 'STAFF']),
        Organization: {
          connect: {
            id: universityId,
          },
        },
        Nationality: {
          connect: {
            code: nationality,
          },
        },
      },
    });

    users.push(user);
  }

  return users;
};
