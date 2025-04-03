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

import { Inject, Injectable } from '@nestjs/common';
import { RessourceDoesNotExist } from 'src/core/errors';
import { Language } from 'src/core/models';
import { LogEntryType } from 'src/core/models/log-entry.model';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import {
  VocabularyRepository,
  VOCABULARY_REPOSITORY,
} from 'src/core/ports/vocabulary.repository';
import { CreateOrUpdateLogEntryUsecase } from 'src/core/usecases/log-entry';

export class UpdateVocabularyListCommand {
  vocabularyListId: string;
  name?: string;
  symbol?: string;
  profileIds?: string[];
  wordLanguageCode?: string;
  translationLanguageCode?: string;
  userId?: string;
}

@Injectable()
export class UpdateVocabularyListUsecase {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(VOCABULARY_REPOSITORY)
    private readonly vocabularyRepository: VocabularyRepository,
    @Inject(CreateOrUpdateLogEntryUsecase)
    private readonly createOrUpdateLogEntryUsecase: CreateOrUpdateLogEntryUsecase,
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
  ) {}

  async execute(command: UpdateVocabularyListCommand) {
    const oldVocabularyList = await this.assertVocabularyListExist(
      command.vocabularyListId,
    );
    let wordLanguage: Language | undefined;
    let translationLanguage: Language | undefined;
    if (command.wordLanguageCode) {
      wordLanguage = await this.assertLanguageExist(command.wordLanguageCode);
    }
    if (command.translationLanguageCode) {
      translationLanguage = await this.assertLanguageExist(
        command.translationLanguageCode,
      );
    }
    await Promise.all(
      command.profileIds.map((profileId) => this.assertProfileExist(profileId)),
    );

    const vocabularyList = await this.vocabularyRepository.updateVocabularyList(
      {
        id: command.vocabularyListId,
        name: command.name ?? oldVocabularyList.name,
        symbol: command.symbol ?? oldVocabularyList.symbol,
        profileIds: command.profileIds,
        wordLanguageId: wordLanguage?.id ?? oldVocabularyList.wordLanguage.id,
        translationLanguageId:
          translationLanguage?.id ?? oldVocabularyList.translationLanguage.id,
      },
    );

    if (command.profileIds && command.profileIds.length > 0) {
      const learningLanguage =
        vocabularyList.creator?.findLearningLanguageByCode(
          vocabularyList.translationLanguage.code,
        );
      if (learningLanguage) {
        await this.createOrUpdateLogEntryUsecase.execute({
          learningLanguageId: learningLanguage.id,
          type: LogEntryType.SHARE_VOCABULARY,
          metadata: {
            vocabularyListId: command.vocabularyListId,
            vocabularyListName: vocabularyList.name,
          },
        });
      }
    }

    return vocabularyList;
  }

  private async assertVocabularyListExist(id: string) {
    const vocabularyList =
      await this.vocabularyRepository.findVocabularyListById(id);

    if (!vocabularyList) {
      throw new RessourceDoesNotExist('Vocabulary list does not exist');
    }

    return vocabularyList;
  }

  private async assertProfileExist(profileId: string) {
    const profile = await this.profileRepository.ofId(profileId);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertLanguageExist(languageId: string) {
    const language = await this.languageRepository.ofCode(languageId);

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }
}
