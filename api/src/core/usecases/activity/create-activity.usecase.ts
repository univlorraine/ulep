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
import { ProficiencyLevel } from 'src/core/models';
import { ActivityVocabulary } from 'src/core/models/activity.model';
import {
  ActivityRepository,
  ACTIVITY_REPOSITORY,
} from 'src/core/ports/activity.repository';
import {
  LanguageRepository,
  LANGUAGE_REPOSITORY,
} from 'src/core/ports/language.repository';
import {
  ProfileRepository,
  PROFILE_REPOSITORY,
} from 'src/core/ports/profile.repository';
import { UploadAudioVocabularyActivityUsecase } from 'src/core/usecases/media';
const ogs = require('open-graph-scraper');

export class CreateActivityCommand {
  title: string;
  description: string;
  profileId?: string;
  universityId?: string;
  themeId: string;
  exercises: { content: string; order: number }[];
  vocabularies: { content: string; pronunciation?: Express.Multer.File }[];
  languageLevel: ProficiencyLevel;
  languageCode: string;
  ressourceUrl?: string;
  creditImage?: string;
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

@Injectable()
export class CreateActivityUsecase {
  constructor(
    @Inject(LANGUAGE_REPOSITORY)
    private readonly languageRepository: LanguageRepository,
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,
    @Inject(ACTIVITY_REPOSITORY)
    private readonly activityRepository: ActivityRepository,
    @Inject(UploadAudioVocabularyActivityUsecase)
    private readonly uploadAudioVocabularyActivityUsecase: UploadAudioVocabularyActivityUsecase,
  ) {}

  async execute(command: CreateActivityCommand) {
    await this.assertLanguageExist(command.languageCode);

    if (command.profileId) {
      await this.assertProfileExist(command.profileId);
    }

    await this.assertThemeExist(command.themeId);

    let openGraphResult: any;
    const url = command.ressourceUrl
      ? command.ressourceUrl.match(URL_REGEX)?.[0]
      : undefined;
    if (url) {
      try {
        const result = await ogs({ url });
        if (result.result.success) {
          openGraphResult = result.result;
        }
      } catch (err) {
        console.warn(err);
        console.warn('Url not found for open graph', url);
      }
    }

    if (!command.universityId && command.profileId) {
      const userProfile = await this.profileRepository.ofId(command.profileId);
      command.universityId = userProfile.user.university.id;
    }

    const activity = await this.activityRepository.createActivity({
      title: command.title,
      description: command.description,
      profileId: command.profileId,
      universityId: command.universityId,
      themeId: command.themeId,
      exercises: command.exercises,
      languageLevel: command.languageLevel,
      languageCode: command.languageCode,
      ressourceUrl: command.ressourceUrl,
      creditImage: command.creditImage,
      metadata: {
        openGraph: openGraphResult,
      },
    });

    const activityVocabularies: ActivityVocabulary[] = [];
    if (command.vocabularies) {
      for (const vocabulary of command.vocabularies) {
        activityVocabularies.push(
          await this.createVocabularyForActivity(
            activity.id,
            vocabulary.content,
            vocabulary.pronunciation,
          ),
        );
      }
    }

    activity.activityVocabularies = activityVocabularies;

    return activity;
  }

  private async assertLanguageExist(code: string) {
    const language = await this.languageRepository.ofCode(code.toLowerCase());

    if (!language) {
      throw new RessourceDoesNotExist('Language does not exist');
    }

    return language;
  }

  private async assertProfileExist(id: string) {
    const profile = await this.profileRepository.ofId(id);

    if (!profile) {
      throw new RessourceDoesNotExist('Profile does not exist');
    }
  }

  private async assertThemeExist(id: string) {
    const theme = await this.activityRepository.ofThemeId(id);

    if (!theme) {
      throw new RessourceDoesNotExist('Theme does not exist');
    }
  }

  private async createVocabularyForActivity(
    activityId: string,
    content: string,
    pronunciation?: Express.Multer.File,
  ) {
    const vocabulary =
      await this.activityRepository.createVocabularyForActivity(
        activityId,
        content,
      );
    if (pronunciation) {
      const audioUrl = await this.uploadAudioVocabularyActivityUsecase.execute({
        vocabularyId: vocabulary.id,
        file: pronunciation,
      });

      vocabulary.pronunciationActivityVocabularyUrl = audioUrl;
    }

    return vocabulary;
  }
}
