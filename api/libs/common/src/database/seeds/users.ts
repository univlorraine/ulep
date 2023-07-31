import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';

const countriesCodes = ['DE', 'FR'];

export const createUsers = async (
  count: number,
  prisma: Prisma.PrismaClient,
): Promise<Prisma.Users[]> => {
  const users: Prisma.Users[] = [];

  const universities = await prisma.organizations.findMany();

  for (let i = 0; i < count; i++) {
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
            id: faker.helpers.arrayElement(universities).id,
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
