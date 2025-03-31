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

import { Activity } from 'src/core/models/activity.model';
import {
  LearningLanguage,
  LearningObjective,
  MediaObject,
  News,
  University,
  User,
} from '../models';
import { Edito } from '../models/edito.model';
import { EventObject } from '../models/event.model';
import { Instance } from '../models/Instance.model';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
  avatarOfUser(userId: string): Promise<MediaObject | null>;

  saveImageOfActivity(activity: Activity, object: MediaObject): Promise<void>;

  saveRessourceOfActivity(
    activity: Activity,
    object: MediaObject,
  ): Promise<void>;

  audioTranslatedOfVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
  ): Promise<MediaObject | null>;

  saveAudioVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
    object: MediaObject,
  ): Promise<void>;

  audioTranslatedOfVocabularyActivity(
    vocabularyId: string,
  ): Promise<MediaObject | null>;

  saveAudioVocabularyActivity(
    vocabularyId: string,
    object: MediaObject,
  ): Promise<void>;

  saveAvatar: (user: User, object: MediaObject) => Promise<void>;

  save(object: MediaObject): Promise<void>;

  saveObjectiveImage: (
    objective: LearningObjective,
    object: MediaObject,
  ) => Promise<void>;

  saveUniversityImage: (
    university: University,
    object: MediaObject,
  ) => Promise<void>;

  saveNewsImage: (news: News, object: MediaObject) => Promise<void>;

  saveEventImage: (event: EventObject, object: MediaObject) => Promise<void>;

  saveEditoImage: (edito: Edito, object: MediaObject) => Promise<void>;

  findOne(id: string): Promise<MediaObject | null>;

  saveInstanceDefaultCertificate: (
    instance: Instance,
    object: MediaObject,
  ) => Promise<void>;

  saveUniversityDefaultCertificate: (
    university: University,
    object: MediaObject,
  ) => Promise<void>;

  saveLearningLanguageCertificate: (
    learningLanguage: LearningLanguage,
    object: MediaObject,
  ) => Promise<void>;

  remove(id: string): Promise<void>;
}
