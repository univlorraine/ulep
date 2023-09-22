import { PrismaClient } from '@prisma/client';

const interests: { category: string; items: string[] }[] = [
  {
    category: 'Sports',
    items: [
      'Surf',
      'Randonnée',
      'Course',
      'Vélo',
      'Dance',
      'Bodybuilding',
      'Football',
      'Basketball',
      'Tennis',
      'Rugby',
      'Volleyball',
      'Natation',
      'Yoga',
      'Equitation',
      'Skateboarding',
    ],
  },
  {
    category: 'Voyage',
    items: ['Place', 'Montagne', 'Ville', 'Forêt'],
  },
  {
    category: 'Musique',
    items: [
      'Rock',
      'Pop',
      'Rap',
      'Jazz',
      'Classique',
      'Metal',
      'Electro',
      'Reggae',
      'Blues',
      'Soul',
      'Funk',
    ],
  },
  {
    category: 'Loisirs',
    items: [
      'Couture',
      'Jeux Vidéos',
      'Chant',
      'DIY',
      'Théâtre',
      'Jeux de sociétés',
      'Cuisine',
      'Photographie',
      'Peinture',
      'Lecture',
      'Ecriture',
      'Jardinage',
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
