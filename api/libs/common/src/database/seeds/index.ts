/**
 *
 *   Copyright ou © ou Copr. Université de Lorraine, (2025)
 *
 *   Direction du Numérique de l'Université de Lorraine - SIED
 *
 *   Ce logiciel est un programme informatique servant à rendre accessible
 *   sur mobile et sur internet l'application ULEP (University Language
 *   Exchange Programme) aux étudiants et aux personnels des universités
 *   parties prenantes.
 *
 *   Ce logiciel est régi par la licence CeCILL 2.1, soumise au droit français
 *   et respectant les principes de diffusion des logiciels libres. Vous pouvez
 *   utiliser, modifier et/ou redistribuer ce programme sous les conditions
 *   de la licence CeCILL telle que diffusée par le CEA, le CNRS et INRIA
 *   sur le site "http://cecill.info".
 *
 *   En contrepartie de l'accessibilité au code source et des droits de copie,
 *   de modification et de redistribution accordés par cette licence, il n'est
 *   offert aux utilisateurs qu'une garantie limitée. Pour les mêmes raisons,
 *   seule une responsabilité restreinte pèse sur l'auteur du programme, le
 *   titulaire des droits patrimoniaux et les concédants successifs.
 *
 *   À cet égard, l'attention de l'utilisateur est attirée sur les risques
 *   associés au chargement, à l'utilisation, à la modification et/ou au
 *   développement et à la reproduction du logiciel par l'utilisateur étant
 *   donné sa spécificité de logiciel libre, qui peut le rendre complexe à
 *   manipuler et qui le réserve donc à des développeurs et des professionnels
 *   avertis possédant des connaissances informatiques approfondies. Les
 *   utilisateurs sont donc invités à charger et à tester l'adéquation du
 *   logiciel à leurs besoins dans des conditions permettant d'assurer la
 *   sécurité de leurs systèmes et/ou de leurs données et, plus généralement,
 *   à l'utiliser et à l'exploiter dans les mêmes conditions de sécurité.
 *
 *   Le fait que vous puissiez accéder à cet en-tête signifie que vous avez
 *   pris connaissance de la licence CeCILL 2.1, et que vous en avez accepté les
 *   termes.
 *
 */

import * as Prisma from '@prisma/client';
import { parseArgs } from 'node:util';
import { createActivityThemes } from './activity';
import { createCountries } from './countries';
import { createEvents } from './events';
import { createInstance } from './instance';
import { createInterests } from './interests';
import { createLanguageCodes } from './languages';
import { createNews } from './news';
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
      await prisma.activityVocabulary.deleteMany();
      await prisma.activityExercises.deleteMany();
      await prisma.activity.deleteMany();
      await prisma.activityThemeCategories.deleteMany();
      await prisma.activityThemes.deleteMany();
      await prisma.users.deleteMany();
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
      await prisma.events.deleteMany();
      await prisma.news.deleteMany();
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
      await createNews(20, prisma);
      await createEvents(40, prisma);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
