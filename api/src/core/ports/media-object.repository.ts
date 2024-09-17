import { LearningObjective, MediaObject, University, User } from '../models';
import { Instance } from '../models/Instance.model';

export const MEDIA_OBJECT_REPOSITORY = 'media-object.repository';

export interface MediaObjectRepository {
  avatarOfUser(userId: string): Promise<MediaObject | null>;

  audioTranslatedOfVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
  ): Promise<MediaObject | null>;

  saveAudioVocabulary(
    vocabularyId: string,
    isTranslation: boolean,
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

  findOne(id: string): Promise<MediaObject | null>;

  saveInstanceDefaultCertificate: (
    instance: Instance,
    object: MediaObject,
  ) => Promise<void>;

  saveUniversityDefaultCertificate: (
    university: University,
    object: MediaObject,
  ) => Promise<void>;

  remove(id: string): Promise<void>;
}
