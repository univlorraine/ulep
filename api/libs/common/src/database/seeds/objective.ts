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

import { PrismaClient } from '@prisma/client';

export enum ObjectiveIds {
  ORAL_PRACTICE = 'eaf9948e-3a55-473a-b1f7-6634eec2a621',
  WRITING_PRACTICE = 'ce567cf5-8b3b-42c5-b816-f9e0a6f5d7f8',
  DISCOVER_CULTURE = '889f9ffe-08b5-4bb2-bb57-48a84739d198',
  DISCOVER_LANGUAGE = 'b75a2c18-3026-431a-a0af-af3f30fd2f44',
  GET_CERTIFICATION = '49f3bb2d-75cb-4421-afef-2f4207722bdc',
}

const objectives = [
  {
    id: ObjectiveIds.DISCOVER_LANGUAGE,
    text: 'Découvrir une nouvelle langue',
    translations: [
      { code: 'en', content: 'Discover a new language' },
      { code: 'zh', content: '探索一门新语言' },
      { code: 'de', content: 'Eine neue Sprache entdecken' },
      { code: 'es', content: 'Descubrir otro idioma' },
    ],
  },
  {
    id: ObjectiveIds.DISCOVER_CULTURE,
    text: 'Découvrir une culture',
    translations: [
      { code: 'en', content: 'Discover a culture' },
      { code: 'zh', content: '探索一种文化' },
      { code: 'de', content: 'Eine Kultur entdecken' },
      { code: 'es', content: 'Descubrir una cultura' },
    ],
  },
  {
    id: ObjectiveIds.ORAL_PRACTICE,
    text: 'Améliorer mes compétences orales',
    translations: [
      { code: 'en', content: 'Improve my oral skills' },
      { code: 'zh', content: '改进我的口语能力' },
      { code: 'de', content: 'Meine mündlichen Fähigkeiten verbessern' },
      { code: 'es', content: 'Mejorar mis competencias orales' },
    ],
  },
  {
    id: ObjectiveIds.WRITING_PRACTICE,
    text: 'Améliorer mes compétences écrites',
    translations: [
      { code: 'en', content: 'Improve my written skills' },
      { code: 'zh', content: '改进我的写作能力' },
      { code: 'de', content: 'Meine schriftlichen Fähigkeiten verbessern' },
      { code: 'es', content: 'Mejorar mis competencias escritas' },
    ],
  },
  {
    id: ObjectiveIds.GET_CERTIFICATION,
    text: 'Obtenir un certificat (e)Tandem',
    translations: [
      { code: 'en', content: 'Receive an (e)Tandem certificate' },
      { code: 'zh', content: '获得一个(远程)语伴证书' },
      { code: 'de', content: 'Ein (e)Tandem-Zertifikat erhalten' },
      { code: 'es', content: 'Obtener un certificado de E-Tándem' },
    ],
  },
];

export const createLearningObjectives = async (
  prisma: PrismaClient,
): Promise<void> => {
  for (const objective of objectives) {
    await prisma.learningObjectives.create({
      data: {
        id: objective.id,
        TextContent: {
          create: {
            text: objective.text,
            Translations: {
              create: objective.translations?.map((translation) => ({
                text: translation.content,
                LanguageCode: { connect: { code: translation.code } },
              })),
            },
            LanguageCode: { connect: { code: 'fr' } },
          },
        },
      },
    });
  }
};
