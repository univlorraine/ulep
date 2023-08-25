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
    if (i % 20 === 0) {
      // 1 of 20 doesn't have french nationality
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
