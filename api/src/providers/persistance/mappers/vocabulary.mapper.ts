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

import { Prisma } from '@prisma/client';
import { MediaObject } from 'src/core/models';
import { Vocabulary, VocabularyList } from 'src/core/models/vocabulary.model';
import { languageMapper } from 'src/providers/persistance/mappers/language.mapper';
import {
  profileMapper,
  ProfilesRelations,
} from 'src/providers/persistance/mappers/profile.mapper';

export const VocabularyInclude = Prisma.validator<Prisma.VocabularyInclude>()({
  PronunciationWord: true,
  PronunciationTranslation: true,
});

export const VocabularyRelations = { include: VocabularyInclude };

export type VocabularySnapshot = Prisma.VocabularyGetPayload<
  typeof VocabularyRelations
>;

export const vocabularyMapper = (snapshot: VocabularySnapshot): Vocabulary => {
  return new Vocabulary({
    id: snapshot.id,
    word: snapshot.word,
    translation: snapshot.translation,
    pronunciationWord:
      snapshot.PronunciationWord &&
      new MediaObject({
        id: snapshot.PronunciationWord.id,
        name: snapshot.PronunciationWord.name,
        bucket: snapshot.PronunciationWord.bucket,
        mimetype: snapshot.PronunciationWord.mime,
        size: snapshot.PronunciationWord.size,
      }),
    pronunciationTranslation:
      snapshot.PronunciationTranslation &&
      new MediaObject({
        id: snapshot.PronunciationTranslation.id,
        name: snapshot.PronunciationTranslation.name,
        bucket: snapshot.PronunciationTranslation.bucket,
        mimetype: snapshot.PronunciationTranslation.mime,
        size: snapshot.PronunciationTranslation.size,
      }),
  });
};

export const VocabularyListInclude =
  Prisma.validator<Prisma.VocabularyListInclude>()({
    OriginalLanguage: true,
    TranslationLanguage: true,
    Creator: { include: ProfilesRelations },
    Editors: { include: ProfilesRelations },
    Readers: { include: ProfilesRelations },
    Vocabulary: VocabularyRelations,
  });

export const VocabularyListRelations = { include: VocabularyListInclude };

export type VocabularyListSnapshot = Prisma.VocabularyListGetPayload<
  typeof VocabularyListRelations
>;

export const vocabularyListMapper = (
  snapshot: VocabularyListSnapshot,
): VocabularyList => {
  return new VocabularyList({
    id: snapshot.id,
    name: snapshot.name,
    symbol: snapshot.symbol,
    readers: snapshot.Readers.map(profileMapper),
    editors: snapshot.Editors.map(profileMapper),
    vocabularies: snapshot.Vocabulary.map(vocabularyMapper),
    wordLanguage: languageMapper(snapshot.OriginalLanguage),
    translationLanguage: languageMapper(snapshot.TranslationLanguage),
    creator: profileMapper(snapshot.Creator),
  });
};
