import * as Prisma from '@prisma/client';
import { parseArgs } from 'node:util';
import { createActivityThemes } from './activity';
import { createCountries } from './countries';
import { createInstance } from './instance';
import { createInterests } from './interests';
import { createLanguageCodes } from './languages';
import { createLearningObjectives } from './objective';
import { createProficiencyTests } from './proficiency';
import { createProfiles } from './profiles';
import { createReportCategories } from './report';
import { insertUlData } from './ulDataSeed';
import {
  createCentralUniversityPlaceholder,
  createUniversities,
} from './universities';
import { createUsers } from './users';

const prisma = new Prisma.PrismaClient();

const load = async () => {
  try {
    const { values } = parseArgs({
      options: {
        delete: { type: 'boolean' },
        seed: { type: 'string' },
      },
    });

    const deleteCurrent = !!values.delete;
    const seedRandomDataset = values.seed === 'random';
    const seedULDataset = values.seed === 'ul';

    if (deleteCurrent) {
      console.info('[DB seed] delete existing data');
      await prisma.unmatchedLearningLanguages.deleteMany();
      await prisma.blacklist.deleteMany();
      await prisma.purges.deleteMany();
      await prisma.tandemHistory.deleteMany();
      await prisma.learningLanguages.deleteMany();
      await prisma.masteredLanguages.deleteMany();
      await prisma.testedLanguages.deleteMany();
      await prisma.users.deleteMany();
      await prisma.activityThemeCategories.deleteMany();
      await prisma.activityThemes.deleteMany();
      await prisma.refusedTandems.deleteMany();
      await prisma.organizations.deleteMany();
      await prisma.translations.deleteMany();
      await prisma.languageCodes.deleteMany();
      await prisma.countryCodes.deleteMany();
      await prisma.proficiencyTests.deleteMany();
      await prisma.interestCategories.deleteMany();
      await prisma.interests.deleteMany();
      await prisma.learningObjectives.deleteMany();
      await prisma.textContent.deleteMany();
      await prisma.reportCategories.deleteMany();
      await prisma.routineExecutions.deleteMany();
      await prisma.tandems.deleteMany();
      await prisma.instance.deleteMany();
    }

    await createInstance(prisma);
    await createCountries(prisma);
    await createLanguageCodes(prisma);
    await createReportCategories(prisma);
    await createProficiencyTests(prisma);
    await createInterests(prisma);
    await createLearningObjectives(prisma);
    await createActivityThemes(prisma);

    if (seedULDataset || seedRandomDataset) {
      await createUniversities(prisma);
    } else {
      await createCentralUniversityPlaceholder(prisma);
    }
    if (seedULDataset) {
      console.info('[DB seed] UL dataset');
      await insertUlData(prisma);
    } else if (seedRandomDataset) {
      console.info('[DB seed] random dataset');
      await createUsers(200, 100, prisma);
      await createProfiles(prisma);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
