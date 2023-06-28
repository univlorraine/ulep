import * as Prisma from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new Prisma.PrismaClient();

const countriesCodes = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'CN', name: 'China' },
];

const languagesCodes = [
  { code: 'DE', name: 'German', isEnable: true },
  { code: 'FR', name: 'French', isEnable: true },
  { code: 'ZH', name: 'Chinese', isEnable: false },
];

const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const mapCountryCodeToLanguageCode = (countryCode: string): string => {
  switch (countryCode) {
    case 'DE':
      return 'DE';
    case 'FR':
      return 'FR';
    case 'CN':
      return 'ZH';
    default:
      throw new Error(`Unknown country code: ${countryCode}`);
  }
};

const createCountries = async () => {
  for (const country of countriesCodes) {
    await prisma.countryCode.create({
      data: { code: country.code, name: country.name },
    });
  }
};

const createLanguages = async () => {
  for (const language of languagesCodes) {
    await prisma.languageCode.create({
      data: { code: language.code, name: language.name },
    });
  }
};

const createOrganization = async () => {
  await prisma.organization.create({
    data: {
      name: 'Université de Lorraine',
      country: { connect: { code: 'FR' } },
      timezone: 'Europe/Paris',
      admissionStart: new Date('2023-01-01'),
      admissionEnd: new Date('2023-12-31'),
    },
  });
};

const createUsers = async (count: number): Promise<Prisma.UserEntity[]> => {
  const users: Prisma.UserEntity[] = [];

  for (let i = 0; i < count; i++) {
    const user = await prisma.userEntity.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        roles: { set: ['ROLE_USER'] },
      },
    });

    users.push(user);
  }

  return users;
};

const createProfiles = async (users: Prisma.UserEntity[]): Promise<void> => {
  for (const user of users) {
    const countryCode: string = faker.helpers.arrayElement(countriesCodes).code;
    const nativeLanguageCode = mapCountryCodeToLanguageCode(countryCode);
    const availableLanguagesCodes: string[] = languagesCodes
      .filter((l) => l.code !== nativeLanguageCode)
      .map((l) => l.code);

    await prisma.profile.create({
      data: {
        user: { connect: { id: user.id } },
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        gender: faker.helpers.enumValue(Prisma.Gender),
        role: faker.helpers.enumValue(Prisma.Role),
        nationality: { connect: { code: countryCode } },
        nativeLanguage: {
          create: {
            languageCode: { connect: { code: nativeLanguageCode } },
          },
        },
        learningLanguage: {
          create: {
            languageCode: {
              connect: {
                code: faker.helpers.arrayElement(availableLanguagesCodes),
              },
            },
            proficiencyLevel: faker.helpers.arrayElement(levels),
          },
        },
        organization: { connect: { name: 'Université de Lorraine' } },
        metadata: {},
      },
      include: { nationality: true },
    });
  }
};

const load = async () => {
  try {
    await createCountries();
    await createLanguages();
    await createOrganization();
    const users = await createUsers(1000);
    await createProfiles(users);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
