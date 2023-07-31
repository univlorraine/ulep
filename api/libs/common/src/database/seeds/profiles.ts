const levels = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

const countriesCodes = ['DE', 'FR'];

const languagesCodes = ['de', 'fr'];

const gender = ['male', 'female', 'other'];

const roles = ['student', 'staff'];

const mapCountryCodeToLanguageCode = (countryCode: string): string => {
  switch (countryCode) {
    case 'DE':
      return 'de';
    case 'FR':
      return 'fr';
    case 'CN':
      return 'zh';
    default:
      throw new Error(`Unknown country code: ${countryCode}`);
  }
};

// export const createProfiles = async (
//   count: number,
//   prisma: Prisma.PrismaClient,
// ): Promise<void> => {
//   const users = await createUsers(count, prisma);

//   for (const user of users) {
//     const countryCode: string = faker.helpers.arrayElement(countriesCodes);
//     const nativeLanguageCode = mapCountryCodeToLanguageCode(countryCode);
//     const availableLanguagesCodes: string[] = languagesCodes.filter(
//       (languageCode) => languageCode !== nativeLanguageCode,
//     );

//     await prisma.profile.create({
//       data: {
//         user: { connect: { id: user.id } },
//         nativeLanguage: {
//           connect: {
//             code: nativeLanguageCode,
//           },
//         },
//         learningLanguage: {
//           connect: {
//             code: faker.helpers.arrayElement(availableLanguagesCodes),
//           },
//         },
//         learningLanguageLevel: faker.helpers.arrayElement(levels),
//         preferences: {
//           create: {
//             type: 'ETANDEM',
//             sameGender: faker.datatype.boolean(),
//             sameAge: faker.datatype.boolean(),
//             // TODO: add goals
//           },
//         },
//         metadata: {
//           frequency: faker.helpers.arrayElement([
//             'ONCE_A_WEEK',
//             'TWICE_A_WEEK',
//             'THREE_TIMES_A_WEEK',
//             'TWICE_A_MONTH',
//             'THREE_TIMES_A_MONTH',
//           ]),
//           availability: {
//             tuesday: true,
//             monday: true,
//             wednesday: true,
//             thursday: true,
//             friday: true,
//             saturday: true,
//             sunday: true,
//           },
//           interests: faker.helpers.arrayElements(interests, {
//             min: 1,
//             max: 5,
//           }),
//           bios: faker.lorem.paragraph(),
//         },
//       },
//     });
//   }
// };
