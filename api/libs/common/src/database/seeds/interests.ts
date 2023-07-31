import { PrismaClient } from '@prisma/client';

const interests: { category: string; items: string[] }[] = [
  {
    category: 'Sports',
    items: [
      'Surf',
      'Hiking',
      'Running',
      'Cycling',
      'Dancing',
      'Bodybuilding',
      'Soccer',
      'Basketball',
      'Tennis',
      'Rugby',
      'Volleyball',
      'Swimming',
      'Yoga',
      'Horse riding',
      'Skateboarding',
    ],
  },
  {
    category: 'Travels',
    items: ['Beach', 'Mountains', 'City', 'Forest'],
  },
  {
    category: 'Music',
    items: [
      'Rock',
      'Pop',
      'Rap',
      'Jazz',
      'Classic',
      'Metal',
      'Electro',
      'Reggae',
      'Blues',
      'Soul',
      'Funk',
    ],
  },
  {
    category: 'Hobbies',
    items: [
      'Sewing',
      'Video games',
      'Singing',
      'DIY',
      'Theater',
      'Board games',
      'Cooking',
      'Photography',
      'Painting',
      'Reading',
      'Writing',
      'Gardening',
    ],
  },
];

export const createInterests = async (prisma: PrismaClient): Promise<void> => {
  for (const interest of interests) {
    const category = await prisma.interestCategories.create({
      data: {
        TextContent: {
          create: {
            text: interest.category,
            LanguageCode: { connect: { code: 'en' } },
          },
        },
      },
    });

    for (const item of interest.items) {
      await prisma.interests.create({
        data: {
          Category: {
            connect: {
              id: category.id,
            },
          },
          TextContent: {
            create: {
              text: item,
              LanguageCode: { connect: { code: 'en' } },
            },
          },
        },
      });
    }
  }
};
