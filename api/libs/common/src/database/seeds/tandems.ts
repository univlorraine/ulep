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

import { faker } from '@faker-js/faker';
import * as Prisma from '@prisma/client';

export const createTandems = async (
  prisma: Prisma.PrismaClient,
  tandemCount: number = 100,
): Promise<void> => {
  console.info(`[DB seed] Creating tandems using simplified logic`);

  // Get available learning languages
  const learningLanguages = await prisma.learningLanguages.findMany({
    where: {
      tandem_id: null, // Only unpaired learning languages
    },
    include: {
      LanguageCode: true,
      Profile: {
        include: {
          User: {
            include: {
              Organization: true,
            },
          },
          NativeLanguage: true,
        },
      },
    },
  });

  if (learningLanguages.length < 2) {
    console.warn('[DB seed] Not enough learning languages to create tandems');
    return;
  }

  const tandemsCreated: string[] = [];
  let attempts = 0;
  const maxAttempts = tandemCount * 10;

  while (tandemsCreated.length < tandemCount && attempts < maxAttempts) {
    attempts++;

    // Select two learning languages randomly
    const [learningLang1, learningLang2] = faker.helpers.arrayElements(
      learningLanguages,
      2,
    );

    // Check that they are not the same learning languages
    if (learningLang1.id === learningLang2.id) {
      continue;
    }

    // Check that the profiles are different
    if (learningLang1.Profile.id === learningLang2.Profile.id) {
      continue;
    }

    // Check that at least one profile is from a central university
    const isCentral1 = !learningLang1.Profile.User.Organization.parent_id;
    const isCentral2 = !learningLang2.Profile.User.Organization.parent_id;

    if (!isCentral1 && !isCentral2) {
      continue;
    }

    // Check language compatibility (native language of one = learned language of the other)
    const isCompatible =
      learningLang1.LanguageCode.code ===
        learningLang2.Profile.NativeLanguage.code &&
      learningLang2.LanguageCode.code ===
        learningLang1.Profile.NativeLanguage.code;

    if (!isCompatible) {
      continue;
    }

    // Create a unique hash to avoid duplicates
    const tandemHash = [learningLang1.id, learningLang2.id].sort().join('_');

    if (tandemsCreated.includes(tandemHash)) {
      continue;
    }

    // Determine tandem status
    const tandemStatus = faker.helpers.weightedArrayElement([
      { weight: 0.3, value: 'DRAFT' },
      { weight: 0.4, value: 'ACTIVE' },
      { weight: 0.2, value: 'PAUSED' },
      { weight: 0.1, value: 'INACTIVE' },
    ]);

    // Determine learning type
    const learningType = faker.helpers.arrayElement([
      'ETANDEM',
      'CLASS',
      'ONLINE',
    ]);

    // Calculate a random but realistic compatibility score
    const compatibilityScore = faker.number.int({
      min: 30,
      max: 95,
    });

    try {
      const tandemId = faker.string.uuid();

      // Check that learning languages are still available
      const [currentLearningLang1, currentLearningLang2] = await Promise.all([
        prisma.learningLanguages.findUnique({
          where: { id: learningLang1.id },
          select: { id: true, tandem_id: true },
        }),
        prisma.learningLanguages.findUnique({
          where: { id: learningLang2.id },
          select: { id: true, tandem_id: true },
        }),
      ]);

      if (!currentLearningLang1 || !currentLearningLang2) {
        continue;
      }

      if (currentLearningLang1.tandem_id || currentLearningLang2.tandem_id) {
        continue;
      }

      // Create the tandem first
      await prisma.tandems.create({
        data: {
          id: tandemId,
          status: tandemStatus as string,
          learning_type: learningType as string,
          compatibilityScore: compatibilityScore,
          created_at: faker.date.between({
            from: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            to: new Date(),
          }),
          updated_at: faker.date.recent({ days: 7 }),
        },
      });

      // Update LearningLanguages individually
      const updateResult1 = await prisma.learningLanguages.update({
        where: { id: learningLang1.id },
        data: {
          tandem_id: tandemId,
          tandem_language_code_id: learningLang2.LanguageCode.id,
          learning_type: learningType,
        },
      });

      const updateResult2 = await prisma.learningLanguages.update({
        where: { id: learningLang2.id },
        data: {
          tandem_id: tandemId,
          tandem_language_code_id: learningLang1.LanguageCode.id,
          learning_type: learningType,
        },
      });

      // Check that updates were successful
      if (!updateResult1 || !updateResult2) {
        // If one of the updates failed, delete the created tandem
        await prisma.tandems.delete({ where: { id: tandemId } });
        continue;
      }

      tandemsCreated.push(tandemHash);
    } catch (error) {
      console.warn(`[DB seed] Failed to create tandem: ${error.message}`);
    }
  }

  console.info(
    `[DB seed] Successfully created ${tandemsCreated.length} tandems`,
  );
};
