import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';

const countriesCodes = ['DE', 'FR'];

export const createUsers = async (
  count: number,
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

  for (let i = 0; i < count; i++) {
    let universityId = centralUniversity.id;
    if (i % 4 === 0) {
      // We randomly assign a partner university each 4 user. Otherwise he's part of central university
      universityId = faker.helpers.arrayElement(partnerUniversities).id;
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
            code: faker.helpers.arrayElement(countriesCodes),
          },
        },
        // country_code_id: faker.helpers.arrayElement(countryCodes).id,
      },
    });

    users.push(user);
  }

  return users;
};
