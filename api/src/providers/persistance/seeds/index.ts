import { PrismaClient } from '@prisma/client';
import { countries } from './countries';
import { languagesCodes } from './languages';

const prisma = new PrismaClient();

const load = async () => {
  try {
    for (const country of countries) {
      await prisma.countryCode.upsert({
        where: { code: country.code },
        create: country,
        update: {},
      });
    }

    for (const language of languagesCodes) {
      await prisma.languageCode.upsert({
        where: { code: language.code },
        create: language,
        update: {},
      });
    }

    await prisma.organization.upsert({
      where: { name: 'Université de Lorraine' },
      create: {
        name: 'Université de Lorraine',
        country: {
          connect: { code: 'FR' },
        },
        timezone: 'Europe/Paris',
        admissionStart: new Date('2023-01-01'),
        admissionEnd: new Date('2023-12-31'),
      },
      update: {},
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
