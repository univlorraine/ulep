import * as Prisma from '@prisma/client';
import { createLanguageCodes } from './languages';
import { createUniversities } from './universities';
import { createUsers } from './users';
import { createCountries } from './countries';
import { createProficiencyTests } from './proficiency';
import { createInterests } from './interests';
import { createProfiles } from './profiles';
import { createLearningObjectives } from './objective';
import { createReportCategories } from './report';

const prisma = new Prisma.PrismaClient();

const load = async () => {
  try {
    await prisma.learningLanguages.deleteMany();
    await prisma.users.deleteMany();
    await prisma.organizations.deleteMany();
    await prisma.languageCodes.deleteMany();
    await prisma.countryCodes.deleteMany();
    await prisma.proficiencyTests.deleteMany();
    await prisma.interestCategories.deleteMany();
    await prisma.interests.deleteMany();
    await prisma.learningObjectives.deleteMany();
    await prisma.textContent.deleteMany();
    await prisma.reportCategories.deleteMany();
    await prisma.tandems.deleteMany();

    await createCountries(prisma);
    await createLanguageCodes(prisma);
    await createUniversities(prisma);
    await createReportCategories(prisma);
    await createProficiencyTests(prisma);
    await createInterests(prisma);
    await createLearningObjectives(prisma);
    await createUsers(100, prisma);
    await createProfiles(100, prisma);
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
