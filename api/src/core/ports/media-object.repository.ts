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

  imageOfActivity(activityId: string): Promise<MediaObject | null>;

  saveImageOfActivity(activity: Activity, object: MediaObject): Promise<void>;

  ressourceOfActivity(activityId: string): Promise<MediaObject | null>;

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
