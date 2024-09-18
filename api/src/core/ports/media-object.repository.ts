import { Activity } from 'src/core/models/activity.model';
import { LearningObjective, MediaObject, University, User } from '../models';

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

  saveAdminAvatar(object: MediaObject): Promise<void>;

  saveObjectiveImage: (
    objective: LearningObjective,
    object: MediaObject,
  ) => Promise<void>;

  saveUniversityImage: (
    university: University,
    object: MediaObject,
  ) => Promise<void>;

  findOne(id: string): Promise<MediaObject | null>;

  remove(id: string): Promise<void>;
}
