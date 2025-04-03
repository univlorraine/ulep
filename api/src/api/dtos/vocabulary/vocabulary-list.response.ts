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

import * as Swagger from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LanguageResponse } from 'src/api/dtos/languages';
import { VocabularyList } from 'src/core/models/vocabulary.model';

export class VocabularyListResponse {
  @Swagger.ApiProperty({ type: 'string', format: 'uuid' })
  @Expose({ groups: ['read'] })
  id: string;

  @Swagger.ApiProperty({ type: 'string', format: 'date-time' })
  @Expose({ groups: ['read'] })
  createdAt: Date;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  name: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  symbol: string;

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  translationLanguage: LanguageResponse;

  //TODO: remove this property if useless
  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  editorsIds: string[];

  @Swagger.ApiProperty({ type: 'boolean' })
  @Expose({ groups: ['read'] })
  isEditable: boolean;

  @Swagger.ApiProperty({ type: () => LanguageResponse })
  @Expose({ groups: ['read'] })
  wordLanguage: LanguageResponse;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  creatorId: string;

  @Swagger.ApiProperty({ type: 'string' })
  @Expose({ groups: ['read'] })
  creatorName: string;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  numberOfVocabularies: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  missingPronunciationOfWords: number;

  @Swagger.ApiProperty({ type: 'number' })
  @Expose({ groups: ['read'] })
  missingPronunciationOfTranslations: number;

  constructor(partial: Partial<VocabularyListResponse>) {
    Object.assign(this, partial);
  }

  static from(
    vocabularyList: VocabularyList,
    profileId?: string,
  ): VocabularyListResponse {
    return new VocabularyListResponse({
      id: vocabularyList.id,
      name: vocabularyList.name,
      symbol: vocabularyList.symbol,
      editorsIds: vocabularyList.editors.map((profile) => profile.id),
      isEditable:
        vocabularyList.editors.some((editor) => editor.id === profileId) ||
        vocabularyList.creator.id === profileId,
      wordLanguage: LanguageResponse.fromLanguage(vocabularyList.wordLanguage),
      translationLanguage: LanguageResponse.fromLanguage(
        vocabularyList.translationLanguage,
      ),
      creatorId: vocabularyList.creator.id,
      creatorName: `${vocabularyList.creator.user.firstname} ${vocabularyList.creator.user.lastname}`,
      numberOfVocabularies: vocabularyList.vocabularies.length,
      missingPronunciationOfWords: vocabularyList.vocabularies.filter(
        (vocabulary) => !vocabulary.pronunciationWord,
      ).length,
      missingPronunciationOfTranslations: vocabularyList.vocabularies.filter(
        (vocabulary) => !vocabulary.pronunciationTranslation,
      ).length,
    });
  }
}
