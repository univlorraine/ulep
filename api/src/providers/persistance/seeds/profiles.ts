import { faker } from '@faker-js/faker';
import { Gender, PrismaClient, Role, User } from '@prisma/client';
import { Goal, MeetingFrequency } from '../../../core/models/profile';

const levels = ['A1', 'A2', 'B1', 'B2', 'C1'];

const countriesCodes = ['DE', 'FR'];

const languagesCodes = ['DE', 'FR'];

const interests = [
  // SPORTS
  'SURF',
  'HIKING',
  'RUNNING',
  'CYCLING',
  'DANCING',
  'BODYBUILDING',
  'SOCCER',
  'BASKETBALL',
  'TENNIS',
  'RUGBY',
  'VOLLEYBALL',
  'SWIMMING',
  'YODA',
  'HORSE RIDING',
  'SKATEBOARDING',
  // MOVIES
  'ACTION',
  'ROMANCE',
  'DRAMA',
  'COMEDY',
  'HORROR',
  'THRILLER',
  'SCIENCE FICTION',
  'DOCUMENTARY',
  'FANTASY',
  // TRAVELS
  'BEACH',
  'MOUNTAINS',
  'CITY',
  'FOREST',
  // MUSIC
  'ROCK',
  'POP',
  'RAP',
  'JAZZ',
  'CLASSIC',
  'METAL',
  'ELECTRO',
  'REGGAE',
  'BLUES',
  'SOUL',
  'FUNK',
  // HOBBIES
  'SEWING',
  'VIDEO GAMES',
  'SINGING',
  'DIY',
  'THEATER',
  'BOARD GAMES',
  'COOKING',
  'PHOTOGRAPHY',
  'PAINTING',
  'READING',
  'WRITING',
  'GARDENING',
  // INTERESTS
  'ART',
  'SCIENCE',
  'PSYCHOLOGY',
  'HISTORY',
  'FASHION',
  'INFORMATICS',
  'POLITICS',
];

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

const enumToList = (_enum: unknown): string[] => {
  return Object.entries(_enum).map(([, v]) => v.toUpperCase());
};

const createUsers = async (
  count: number,
  prisma: PrismaClient,
): Promise<User[]> => {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const user = await prisma.user.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
      },
    });

    users.push(user);
  }

  return users;
};

export const createProfiles = async (
  count: number,
  prisma: PrismaClient,
): Promise<void> => {
  const users = await createUsers(count, prisma);

  for (const user of users) {
    const countryCode: string = faker.helpers.arrayElement(countriesCodes);
    const nativeLanguageCode = mapCountryCodeToLanguageCode(countryCode);
    const availableLanguagesCodes: string[] = languagesCodes.filter(
      (languageCode) => languageCode !== nativeLanguageCode,
    );

    await prisma.profile.create({
      data: {
        user: { connect: { id: user.id } },
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        birthdate: faker.date.birthdate(),
        gender: faker.helpers.enumValue(Gender),
        role: faker.helpers.enumValue(Role),
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
        metadata: {
          interests: faker.helpers.arrayElements(interests, {
            min: 1,
            max: 5,
          }),
          goals: faker.helpers.arrayElements(enumToList(Goal), {
            min: 1,
            max: 1,
          }),
          preferSameGender: faker.datatype.boolean(),
          meetingFrequency: faker.helpers.enumValue(MeetingFrequency),
        },
      },
      include: { nationality: true },
    });
  }
};
