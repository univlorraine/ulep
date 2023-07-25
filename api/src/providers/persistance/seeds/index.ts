import * as Prisma from '@prisma/client';
import { createLanguages } from './languages';
import { createUniversities } from './universities';
import { createProfiles } from './profiles';
import { createCountries } from './countries';

const prisma = new Prisma.PrismaClient();

const load = async () => {
  try {
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.university.deleteMany();
    await prisma.language.deleteMany();
    await prisma.country.deleteMany();
    await prisma.tandem.deleteMany();

    await createCountries(prisma);
    await createLanguages(prisma);
    await createUniversities(prisma);
    await createProfiles(1000, prisma);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
